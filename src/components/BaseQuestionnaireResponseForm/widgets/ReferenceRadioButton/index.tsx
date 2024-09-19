import { Form, Radio, Space } from 'antd';
import fhirpath from 'fhirpath';
import _ from 'lodash';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { parseFhirQueryExpression } from 'sdc-qrf';

import {
    QuestionnaireItemAnswerOption,
    QuestionnaireResponseItemAnswerValue,
    Resource,
} from '@beda.software/aidbox-types';
import { buildQueryParams, isSuccess } from '@beda.software/remote-data';

import { LoadResourceOption, loadResourceOptions } from 'src/services/questionnaire';
import { getDisplay } from 'src/utils/questionnaire';

import { useFieldController } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import { getDateTypeDisplay } from '../utils';
import { AnswerReferenceProps } from '../reference';

export function useReferenceRadioButton<R extends Resource = any, IR extends Resource = any>({
    questionItem,
    parentPath,
    context,
    overrideGetDisplay,
}: AnswerReferenceProps<R, IR>) {
    const { linkId, repeats, required, answerExpression, choiceColumn, text, entryFormat, renderingStyle, dataType } =
        questionItem;
    const rootFieldPath = [...parentPath, linkId];
    const fieldPath = [...rootFieldPath, ...(repeats ? [] : ['0'])];
    const rootFieldName = rootFieldPath.join('.');

    const fieldName = fieldPath.join('.');
    const fieldController = useFieldController(fieldPath, questionItem);

    const getValueDisplay = (value: QuestionnaireResponseItemAnswerValue) => {
        if (!renderingStyle || !dataType) {
            return getDisplay(value);
        }

        return getDateTypeDisplay({ dataType, renderingStyle, value: value.Reference?.display });
    };

    // TODO: add support for fhirpath and application/x-fhir-query
    const [resourceType, searchParams] = parseFhirQueryExpression(answerExpression!.expression!, context);

    const [loadedOptions, setLoadedOptions] = useState<LoadResourceOption<R>[] | null>(null);

    const loadOptions = useCallback(
        async (searchText: string) => {
            const response = await loadResourceOptions(
                resourceType as any,
                { ...(typeof searchParams === 'string' ? {} : searchParams ?? {}), _ilike: searchText },
                overrideGetDisplay ??
                    ((resource: R) => fhirpath.evaluate(resource, choiceColumn![0]!.path!, context)[0]),
            );

            if (isSuccess(response)) {
                return response.data;
            }

            return [];
        },
        [resourceType, searchParams, choiceColumn, context, overrideGetDisplay],
    );

    const debouncedLoadOptions = _.debounce(
        (searchText: string, callback: (options: QuestionnaireItemAnswerOption[]) => void) => {
            (async () => callback(await loadOptions(searchText)))();
        },
        500,
    );

    useEffect(() => {
        const loadItemControlOptions = async () => {
            const options = await loadOptions('');
            setLoadedOptions(options);
        };

        if (questionItem.itemControl) {
            loadItemControlOptions();
        }
    }, [questionItem.itemControl]);

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
        loadedOptions,
        getValueDisplay,
        onChange,
        validate,
        searchParams,
        resourceType,
        deps,
        fieldController,
        text,
        repeats,
        placeholder: entryFormat,
    };
}

function ReferenceRadioButtonUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { questionItem } = props;
    const { choiceOrientation = 'vertical' } = questionItem;

    const { loadedOptions, getValueDisplay, fieldController } = useReferenceRadioButton(props);

    const { formItem, value, onChange, disabled } = fieldController;

    return loadedOptions ? (
        <Form.Item {...formItem}>
            <Space direction={choiceOrientation}>
                {loadedOptions.map((answerOption) => (
                    <Radio
                        key={JSON.stringify(answerOption)}
                        checked={_.isEqual(value?.value, answerOption.value)}
                        disabled={disabled}
                        onChange={() => onChange(answerOption)}
                        data-testid={`inline-choice__${_.kebabCase(
                            JSON.stringify(getValueDisplay(answerOption.value)),
                        )}`}
                    >
                        {getValueDisplay(answerOption.value)}
                    </Radio>
                ))}
            </Space>
        </Form.Item>
    ) : null;
}

export function ReferenceRadioButton<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { answerExpression, choiceColumn, linkId } = props.questionItem;

    if (!answerExpression || !choiceColumn) {
        console.warn(`answerExpression and choiceColumn must be set for linkId '${linkId}'`);
        return null;
    }

    return <ReferenceRadioButtonUnsafe {...props} />;
}
