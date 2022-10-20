import { Form, Radio } from 'antd';
import { useMemo } from 'react';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';
import { Coding } from 'shared/src/contrib/aidbox';

interface SolidRadioButton {
    adjustLastToRight?: boolean;
}

export function QuestionSolidRadio({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, answerOption, readOnly } = questionItem;
    const { adjustLastToRight } = questionItem as SolidRadioButton;
    const [options, rightOption] = useMemo(() => {
        const options = (answerOption ?? []).map((o) => o.value!.Coding!);
        if (adjustLastToRight) {
            return [options.slice(0, -1), options[options.length - 1]];
        }
        return [options, null];
    }, [answerOption, adjustLastToRight]);

    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    return (
        <Form.Item label={text} name={fieldName}>
            <RadioItems
                options={options}
                rightOption={rightOption}
                disabled={readOnly || qrfContext.readOnly}
            />
        </Form.Item>
    );
}

interface RadioItemsProps {
    value?: Coding;
    onChange?: (e: any) => void;
    options: Coding[];
    rightOption: Coding | null;
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
            {rightOption !== null ? (
                <Radio.Group value={value} onChange={onChange} disabled={disabled}>
                    <Radio.Button key={rightOption.code} value={rightOption.code}>
                        {rightOption.display}
                    </Radio.Button>
                </Radio.Group>
            ) : null}
        </div>
    );
}
