import { Form, Select as ANTDSelect } from 'antd';
import { isArray } from 'lodash';
import { useCallback, useMemo } from 'react';
import Select from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

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
            <Select options={selectOptions} onChange={newOnChange} value={selectValue} />
        </>
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, answerOption, readOnly, hidden, repeats } = questionItem;

    if (answerOption?.[0]?.value?.Coding) {
        const fieldName = repeats ? [...parentPath, linkId] : [...parentPath, linkId, 0, 'value'];

        return (
            <Form.Item label={text} name={fieldName} hidden={hidden}>
                <ChoiceQuestionSelect options={answerOption} />
                {/*<QuestionSelectWrapper isMulti={repeats} options={children} />*/}
            </Form.Item>
        );
    }

    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    return (
        <Form.Item label={text} name={fieldName}>
            <ANTDSelect style={inputStyle} disabled={readOnly || qrfContext.readOnly}>
                {answerOption?.map((answerOption) => (
                    <ANTDSelect.Option
                        label={answerOption.value!.string!}
                        value={answerOption.value!.string!}
                    >
                        {answerOption.value!.string!}
                    </ANTDSelect.Option>
                ))}
            </ANTDSelect>
        </Form.Item>
    );
}
