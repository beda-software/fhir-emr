import { Form } from 'antd';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { ResourcesMap } from 'fhir-react/lib/services/fhir';
import { buildQueryParams } from 'fhir-react/lib/services/instance';
import fhirpath from 'fhirpath';
import _ from 'lodash';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { parseFhirQueryExpression, QuestionItemProps } from 'sdc-qrf';

import { QuestionnaireItemAnswerOption, QuestionnaireResponseItemAnswer, Resource } from 'shared/src/contrib/aidbox';
import { loadResourceOptions } from 'shared/src/services/questionnaire';
import { getAnswerCode, getAnswerDisplay } from 'shared/src/utils/questionnaire';

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
    const { linkId, repeats, required, answerExpression, choiceColumn, text } = questionItem;
    const rootFieldPath = [...parentPath, linkId];
    const fieldPath = [...rootFieldPath, ...(repeats ? [] : ['0'])];
    const rootFieldName = rootFieldPath.join('.');

    const fieldName = fieldPath.join('.');
    const fieldController = useFieldController(fieldPath, questionItem);

    const getDisplay =
        overrideGetDisplay ?? ((resource: R) => fhirpath.evaluate(resource, choiceColumn![0]!.path!, context)[0]);

    // TODO: add support for fhirpath and application/x-fhir-query
    const [resourceType, searchParams] = parseFhirQueryExpression(answerExpression!.expression!, context);

    const loadOptions = async (searchText: string) => {
        const response = await loadResourceOptions(
            resourceType as any,
            { ...(typeof searchParams === 'string' ? {} : searchParams ?? {}), _ilike: searchText },
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

    const depsUrl = `${resourceType}?${buildQueryParams(searchParams as any)}`;

    const deps = [linkId, depsUrl];

    return {
        rootFieldName,
        fieldName,
        debouncedLoadOptions,
        onChange,
        validate,
        searchParams,
        resourceType,
        deps,
        fieldController,
        text,
        repeats,
    };
}

// function buildRules(props: QuestionnaireItem) {
//     const { required } = props;
//     if (required) {
//         return [{ required: true, message: 'This field is required' }];
//     }
//     return [];
// }

function QuestionReferenceUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { debouncedLoadOptions, fieldController, repeats } = useAnswerReference(props);
    const { formItem } = fieldController;

    return (
        <Form.Item {...formItem}>
            <AsyncSelect
                onChange={fieldController.onChange}
                value={repeats ? fieldController.value : [fieldController.value]}
                loadOptions={debouncedLoadOptions}
                defaultOptions
                getOptionLabel={(option) => getAnswerDisplay(option.value)}
                getOptionValue={(option) => getAnswerCode(option.value)}
                isMulti={repeats}
            />
        </Form.Item>
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
