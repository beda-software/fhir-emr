import { Form, Radio } from 'antd';
import { Coding } from 'fhir/r4b';
import { useMemo } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

interface SolidRadioButton {
    adjustLastToRight?: boolean;
}

export function QuestionSolidRadio({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, answerOption } = questionItem;
    const { adjustLastToRight } = questionItem as SolidRadioButton;
    const [options, rightOption] = useMemo(() => {
        const optionsList = (answerOption ?? []).map((o) => o.value!.Coding!);
        if (adjustLastToRight) {
            return [optionsList.slice(0, -1), optionsList[optionsList.length - 1]];
        }
        return [optionsList, null];
    }, [answerOption, adjustLastToRight]);

    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <RadioItems
                options={options}
                rightOption={rightOption}
                disabled={disabled}
                value={value}
                onChange={onChange}
            />
        </Form.Item>
    );
}

interface RadioItemsProps {
    value?: Coding;
    onChange?: (e: any) => void;
    options: Coding[];
    rightOption?: Coding | null;
    disabled?: boolean;
}

function RadioItems({ value, onChange, options, rightOption, disabled }: RadioItemsProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Radio.Group value={value} onChange={onChange} disabled={disabled}>
                {options.map((c) => (
                    <Radio.Button key={c.code} value={c.code}>
                        {c.display}
                    </Radio.Button>
                ))}
            </Radio.Group>
            {rightOption ? (
                <Radio.Group value={value} onChange={onChange} disabled={disabled}>
                    <Radio.Button key={rightOption.code} value={rightOption.code}>
                        {rightOption.display}
                    </Radio.Button>
                </Radio.Group>
            ) : null}
        </div>
    );
}
