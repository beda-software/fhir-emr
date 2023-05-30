import { Form, Select as ANTDSelect } from 'antd';
import { mapSuccess } from 'fhir-react';
import { isArray, debounce } from 'lodash';
import { useCallback, useMemo } from 'react';
import { ControllerFieldState } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';
import { QuestionItemProps } from 'sdc-qrf';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { service } from 'aidbox-react/lib/services/service';

import {
    Coding,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    QuestionnaireResponseItemAnswer,
    ValueSet,
} from 'shared/src/contrib/aidbox';

import { getArrayDisplay, getDisplay } from 'src/utils/questionnaire';

import s from '../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../hooks';

const inputStyle = { backgroundColor: '#F7F9FC' };

export function QuestionSelectWrapper({ value, onChange, options, isMulti }: StateManagerProps<any>) {
    const newValue = useMemo(() => {
        if (value) {
            if (isArray(value)) {
                return value.map((answerItem: any) => ({
                    label: answerItem.value.Coding.display,
                    value: answerItem.value,
                }));
            }
            return {
                label: value.value.Coding.display,
                value: value.value,
            };
        } else {
            return [];
        }
    }, [value]);
    const newOnChange = useCallback(
        (values: any, option: any) => {
            onChange && onChange(values, option);
        },
        [onChange],
    );
    if (isMulti) {
        return (
            <Select
                isMulti
                options={options?.map((c: any) => {
                    return {
                        label: c.value?.Coding.display,
                        value: c.value,
                    };
                })}
                onChange={newOnChange}
                value={newValue}
            />
        );
    }

    return (
        <Select
            options={options?.map((c: any) => {
                return {
                    label: c.value?.Coding.display,
                    value: c.value,
                };
            })}
            onChange={newOnChange}
            value={newValue}
        />
    );
}

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
            <Select options={selectOptions} onChange={newOnChange} value={selectValue} className={s.select} />
        </>
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, answerOption, repeats, required, answerValueSet } = questionItem;
    let fieldName = [...parentPath, linkId, 0, 'value', 'Coding'];

    if (answerOption?.[0]?.value?.Coding) {
        if (repeats) {
            fieldName = [...parentPath, linkId];
        } else {
            fieldName = [...parentPath, linkId, 0];
        }
    }

    const { value, onChange, disabled, hidden, fieldState } = useFieldController(fieldName, questionItem);

    if (answerOption?.[0]?.value?.Coding) {
        return (
            <Form.Item
                label={text}
                hidden={hidden}
                validateStatus={fieldState.invalid ? 'error' : 'success'}
                help={fieldState.invalid && `${text} is required`}
                required={required}
            >
                <ChoiceQuestionSelect
                    options={answerOption}
                    value={!repeats && value ? [value] : value}
                    onChange={onChange}
                />
                {/*<QuestionSelectWrapper isMulti={repeats} options={children} />*/}
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
                hidden={hidden}
                fieldState={fieldState}
            />
        );
    }

    return (
        <Form.Item
            label={text}
            hidden={hidden}
            validateStatus={fieldState.invalid ? 'error' : 'success'}
            help={fieldState.invalid && `${text} is required`}
            required={required}
        >
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
    hidden: boolean | undefined;
    fieldState: ControllerFieldState;
}

interface Option extends Coding {
    value?: {
        Coding: Coding;
    };
}

function getOptionLabel(option: Option) {
    if (option && option.value) {
        return option?.value?.Coding.display!;
    } else return option.display!;
}

function SelectAnswerValueSet(props: SelectAnswerValueSetProps) {
    const { questionItem, value, onChange, hidden, fieldState } = props;
    const { text, required, answerValueSet: valueSetId } = questionItem;
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

                    return expansionEntries.map(
                        (expansion): Option => ({
                            value: {
                                Coding: {
                                    code: expansion.code,
                                    system: expansion.system,
                                    display: expansion.display,
                                },
                            },
                        }),
                    );
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

    const onChangeCoding = useCallback(
        (data: SingleValue<Option>) => {
            onChange(data!.value?.Coding);
        },
        [onChange],
    );

    return (
        <Form.Item
            label={text}
            hidden={hidden}
            validateStatus={fieldState.invalid ? 'error' : 'success'}
            help={fieldState.invalid && `${text} is required`}
            required={required}
        >
            <AsyncSelect<Option>
                loadOptions={debouncedLoadOptions}
                defaultOptions
                getOptionLabel={getOptionLabel}
                onChange={onChangeCoding}
                value={value}
            />
        </Form.Item>
    );
}
