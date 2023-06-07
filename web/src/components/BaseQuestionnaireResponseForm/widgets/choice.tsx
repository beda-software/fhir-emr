import { Form, Select as ANTDSelect, FormItemProps } from 'antd';
import { mapSuccess } from 'fhir-react';
import { debounce } from 'lodash';
import _ from 'lodash';
import { useCallback } from 'react';
import Select, { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { QuestionItemProps } from 'sdc-qrf';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { service } from 'aidbox-react/lib/services/service';

import {
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    QuestionnaireResponseItemAnswer,
    ValueSet,
} from 'shared/src/contrib/aidbox';

import { getArrayDisplay, getDisplay } from 'src/utils/questionnaire';

import s from '../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../hooks';

const inputStyle = { backgroundColor: '#F7F9FC' };

interface ChoiceQuestionSelectProps {
    value?: QuestionnaireResponseItemAnswer[];
    onChange?: (option: QuestionnaireResponseItemAnswer) => void;
    options: QuestionnaireItemAnswerOption[];
}

function ChoiceQuestionSelect(props: ChoiceQuestionSelectProps) {
    const { value, onChange, options } = props;

    const selectOptions = options?.map((c: any) => {
        return {
            label: c.value?.Coding?.display,
            value: c.value,
        };
    });

    const newOnChange = (selectValue: any) => {
        onChange?.({ value: selectValue.value });
    };

    const selectValue = {
        label: getArrayDisplay(value),
        value,
    };

    return (
        <>
            <Select
                options={selectOptions}
                onChange={newOnChange}
                value={selectValue}
                className={s.select}
                isOptionSelected={(option) =>
                    !!value && value?.findIndex((v) => _.isEqual(v?.value, option.value)) !== -1
                }
            />
        </>
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, answerOption, repeats, answerValueSet } = questionItem;
    let fieldName = [...parentPath, linkId, 0, 'value', 'Coding'];

    if (answerOption?.[0]?.value?.Coding) {
        if (repeats) {
            fieldName = [...parentPath, linkId];
        } else {
            fieldName = [...parentPath, linkId, 0];
        }
    }

    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    if (answerOption?.[0]?.value?.Coding) {
        return (
            <Form.Item {...formItem}>
                <ChoiceQuestionSelect
                    options={answerOption}
                    value={!repeats && value ? [value] : value}
                    onChange={onChange}
                />
            </Form.Item>
        );
    }

    if (answerValueSet) {
        return (
            <SelectAnswerValueSet
                questionItem={questionItem}
                value={value}
                onChange={onChange}
                disabled={disabled}
                formItem={formItem}
            />
        );
    }

    return (
        <Form.Item {...formItem}>
            <ANTDSelect style={inputStyle} disabled={disabled} value={value} onChange={onChange}>
                {answerOption?.map((option) => (
                    <ANTDSelect.Option key={JSON.stringify(option)} value={option.value?.string}>
                        {getDisplay(option.value!)}
                    </ANTDSelect.Option>
                ))}
            </ANTDSelect>
        </Form.Item>
    );
}

interface SelectAnswerValueSetProps {
    questionItem: QuestionnaireItem;
    value: any;
    onChange: (option: any) => void;
    disabled: boolean | undefined;
    formItem: FormItemProps;
}

function SelectAnswerValueSet(props: SelectAnswerValueSetProps) {
    const { questionItem, value, onChange, formItem } = props;
    const { answerValueSet } = questionItem;
    const valueSetId = answerValueSet?.split('/').slice(-1);

    const loadOptions = useCallback(
        async (searchText: string) => {
            const response = mapSuccess(
                await service<ValueSet>({
                    url: `ValueSet/${valueSetId}/$expand`,
                    params: {
                        filter: searchText,
                        count: 50,
                    },
                }),
                (expandedValueSet) => {
                    const expansionEntries = Array.isArray(expandedValueSet.expansion?.contains)
                        ? expandedValueSet.expansion!.contains
                        : [];

                    return expansionEntries.map(({ code, system, display }) => ({
                        value: { Coding: { code, system, display } },
                    }));
                },
            );

            if (isSuccess(response)) {
                return response.data;
            }
            return [];
        },
        [valueSetId],
    );

    const debouncedLoadOptions = debounce((searchText, callback) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    const newOnChange = useCallback(
        (data: SingleValue<any>) => {
            onChange(data.value?.Coding);
        },
        [onChange],
    );

    return (
        <Form.Item {...formItem}>
            <AsyncSelect
                loadOptions={debouncedLoadOptions}
                defaultOptions
                onChange={newOnChange}
                getOptionLabel={getOptionLabel}
                value={value}
            />
        </Form.Item>
    );
}

function getOptionLabel(option: { value: { Coding: { display: string } }; display: string }) {
    if (option && option.value) {
        return option.value.Coding.display;
    } else return option.display;
}
