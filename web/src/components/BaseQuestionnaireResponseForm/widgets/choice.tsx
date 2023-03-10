import { Form, Select as ANTDSelect } from 'antd';
import { isArray } from 'lodash';
import { useCallback, useMemo } from 'react';
import Select from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';
import { QuestionItemProps } from 'sdc-qrf';

import { getDisplay } from 'src/utils/questionnaire';

import s from '../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../hooks';

const inputStyle = { backgroundColor: '#F7F9FC' };

export function QuestionSelectWrapper({
    value,
    onChange,
    options,
    isMulti,
}: StateManagerProps<any>) {
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

class Option {}

interface ChoiceQuestionSelectProps {
    value?: any;
    onChange?: (option: Option | null) => void;
    options: any;
}

function ChoiceQuestionSelect(props: ChoiceQuestionSelectProps) {
    const { value, onChange, options } = props;

    const selectOptions = options?.map((c: any) => {
        return {
            label: c.value?.Coding.display,
            value: c.value,
        };
    });

    const newOnChange = (selectValue: any) => {
        onChange && onChange(selectValue.value);
    };

    const selectValue = {
        label: value?.Coding.display,
        value,
    };

    return (
        <>
            <Select
                options={selectOptions}
                onChange={newOnChange}
                value={selectValue}
                className={s.select}
            />
        </>
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, answerOption, repeats } = questionItem;
    let fieldName = [...parentPath, linkId, 0, 'value', 'string'];

    if (answerOption?.[0]?.value?.Coding) {
        if (repeats) {
            fieldName = [...parentPath, linkId];
        } else {
            fieldName = [...parentPath, linkId, 0, 'value'];
        }
    }

    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);

    if (answerOption?.[0]?.value?.Coding) {
        return (
            <Form.Item label={text} hidden={hidden}>
                <ChoiceQuestionSelect options={answerOption} value={value} onChange={onChange} />
                {/*<QuestionSelectWrapper isMulti={repeats} options={children} />*/}
            </Form.Item>
        );
    }

    return (
        <Form.Item label={text} hidden={hidden}>
            <ANTDSelect
                style={inputStyle}
                disabled={disabled}
                value={value}
                onChange={(v) => onChange(v)}
            >
                {answerOption?.map((answerOption) => (
                    <ANTDSelect.Option
                        key={JSON.stringify(answerOption)}
                        value={answerOption.value?.string}
                    >
                        {getDisplay(answerOption.value!)}
                    </ANTDSelect.Option>
                ))}
            </ANTDSelect>
        </Form.Item>
    );
}
