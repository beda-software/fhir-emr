import { Form, Radio } from 'antd';
import { useMemo } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { Coding } from 'shared/src/contrib/aidbox';

import { useFieldController } from '../hooks';

interface SolidRadioButton {
    adjustLastToRight?: boolean;
}

export function QuestionSolidRadio({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, answerOption, required } = questionItem;
    const { adjustLastToRight } = questionItem as SolidRadioButton;
    const [options, rightOption] = useMemo(() => {
        const options = (answerOption ?? []).map((o) => o.value!.Coding!);
        if (adjustLastToRight) {
            return [options.slice(0, -1), options[options.length - 1]];
        }
        return [options, null];
    }, [answerOption, adjustLastToRight]);

    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, hidden, fieldState } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item
            label={text}
            hidden={hidden}
            validateStatus={fieldState.invalid ? 'error' : 'success'}
            help={fieldState.invalid && `${text} is required`}
            required={required}
        >
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
