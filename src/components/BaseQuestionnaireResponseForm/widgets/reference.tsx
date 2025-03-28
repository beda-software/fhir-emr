import { Form } from 'antd';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { parseFhirQueryExpression, QuestionItemProps } from 'sdc-qrf';

import { QuestionnaireItemAnswerOption, QuestionnaireResponseItemAnswer, Resource } from '@beda.software/aidbox-types';
import { RenderRemoteData, ResourcesMap, useService } from '@beda.software/fhir-react';
import { buildQueryParams, isSuccess } from '@beda.software/remote-data';

import { AsyncSelect } from 'src/components/Select';
import { LoadResourceOption, loadResourceOptions } from 'src/services/questionnaire';
import { evaluate } from 'src/utils';
import { getAnswerCode, getAnswerDisplay } from 'src/utils/questionnaire';

import { useFieldController } from '../hooks';

export type AnswerReferenceProps<R extends Resource, IR extends Resource> = QuestionItemProps & {
    overrideGetDisplay?: (resource: R, includedResources: ResourcesMap<R | IR>) => string;
    overrideGetLabel?: (
        o: QuestionnaireItemAnswerOption['value'] | QuestionnaireResponseItemAnswer['value'],
    ) => React.ReactElement | string;
};

interface UseFieldReferenceProps<R extends Resource, IR extends Resource> {
    resourceType: string;
    getDisplay: (resource: R, includedResources: ResourcesMap<R | IR>) => string;
    searchParams?: any;
    required?: boolean;
    repeats?: boolean;
}

export function useFieldReference<R extends Resource = any, IR extends Resource = any>(
    props: UseFieldReferenceProps<R, IR>,
) {
    const { resourceType, getDisplay, searchParams, required, repeats } = props;

    const loadOptions = async (searchText: string) => {
        const response = await loadResourceOptions(
            resourceType,
            { ...(typeof searchParams === 'string' ? {} : searchParams ?? {}), _ilike: searchText },
            undefined,
            getDisplay,
        );

        if (isSuccess(response)) {
            return response.data;
        }

        return [];
    };

    const debouncedLoadOptions = _.debounce(
        (searchText: string, callback: (options: QuestionnaireItemAnswerOption[]) => void) => {
            (async () => callback(await loadOptions(searchText)))();
        },
        500,
    );

    const onChange = (
        _value: SingleValue<QuestionnaireItemAnswerOption> | MultiValue<QuestionnaireItemAnswerOption>,
        action: ActionMeta<QuestionnaireItemAnswerOption>,
    ) => {
        if (!repeats || action.action !== 'select-option') {
            return;
        }
    };

    const validate = required
        ? (inputValue: any) => {
              if (repeats) {
                  if (!inputValue || !inputValue.length) {
                      return 'Choose at least one option';
                  }
              } else {
                  if (!inputValue) {
                      return 'Required';
                  }
              }

              return undefined;
          }
        : undefined;

    return {
        debouncedLoadOptions,
        onChange,
        validate,
        searchParams,
        resourceType,
    };
}

export function useAnswerReference<R extends Resource = any, IR extends Resource = any>({
    questionItem,
    parentPath,
    context,
    overrideGetDisplay,
}: AnswerReferenceProps<R, IR>) {
    const { linkId, repeats, answerExpression, choiceColumn, text, entryFormat, referenceResource } = questionItem;
    const rootFieldPath = [...parentPath, linkId];
    const fieldPath = [...rootFieldPath];
    const rootFieldName = rootFieldPath.join('.');

    const fieldName = fieldPath.join('.');
    const fieldController = useFieldController(fieldPath, questionItem);

    const getDisplay = useCallback(() => {
        if (overrideGetDisplay) {
            return overrideGetDisplay;
        }

        return (resource: R, includedResources: ResourcesMap<R | IR>) =>
            evaluate(resource, choiceColumn![0]!.path!, {
                ...context,
                ...includedResources,
                resource,
            })[0];
    }, [choiceColumn, context, overrideGetDisplay]);

    // TODO: add support for fhirpath and application/x-fhir-query
    const expression = answerExpression!.expression!;
    const [resourceType, searchParams] = useMemo(() => {
        return parseFhirQueryExpression(expression, context);
    }, [expression, context]);

    const loadOptions = useCallback(
        async (searchText: string) => {
            const response = await loadResourceOptions(
                resourceType as any,
                { ...(typeof searchParams === 'string' ? {} : searchParams ?? {}), _ilike: searchText },
                referenceResource,
                getDisplay(),
            );

            return response;
        },
        [getDisplay, referenceResource, resourceType, searchParams],
    );

    const debouncedLoadOptionsCallback = useCallback(
        async (searchText: string) => {
            const optionsRD = await loadOptions(searchText);

            if (isSuccess(optionsRD)) {
                return optionsRD.data;
            }

            return [];
        },
        [loadOptions],
    );

    const debouncedLoadOptions = _.debounce(
        (searchText: string, callback: (options: QuestionnaireItemAnswerOption[]) => void) => {
            (async () => callback(await debouncedLoadOptionsCallback(searchText)))();
        },
        500,
    );

    const [optionsRD] = useService<LoadResourceOption<R>[]>(async () => {
        return await loadOptions('');
    }, [JSON.stringify(searchParams)]);

    const depsUrl = `${resourceType}?${buildQueryParams(searchParams as any)}`;

    const deps = [linkId, depsUrl];

    return {
        rootFieldName,
        fieldName,
        debouncedLoadOptions,
        loadOptions,
        optionsRD,
        searchParams,
        resourceType,
        deps,
        fieldController,
        text,
        repeats,
        placeholder: entryFormat,
        choiceColumn,
    };
}

function QuestionReferenceUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { debouncedLoadOptions, fieldController, repeats, placeholder, optionsRD } = useAnswerReference(props);

    const { formItem, onSelect, disabled } = fieldController;

    return (
        <RenderRemoteData remoteData={optionsRD}>
            {(options) => (
                <Form.Item {...formItem}>
                    <AsyncSelect
                        onChange={onSelect}
                        value={fieldController.value}
                        loadOptions={debouncedLoadOptions}
                        defaultOptions={options}
                        getOptionLabel={(option) => getAnswerDisplay(option.value)}
                        getOptionValue={(option) => getAnswerCode(option.value)}
                        isMulti={repeats}
                        placeholder={placeholder}
                        isDisabled={disabled}
                    />
                </Form.Item>
            )}
        </RenderRemoteData>
    );
}

export function QuestionReference<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { answerExpression, choiceColumn, linkId } = props.questionItem;

    if (!answerExpression || !choiceColumn) {
        console.warn(`answerExpression and choiceColumn must be set for linkId '${linkId}'`);
        return null;
    }

    return <QuestionReferenceUnsafe {...props} />;
}
