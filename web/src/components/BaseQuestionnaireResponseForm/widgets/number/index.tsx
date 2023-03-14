import { Form, InputNumber } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../../hooks';
import { BMI } from './BMI';

const inputStyle = { backgroundColor: '#FFFFFF', width: '100%' };

interface NumericItem {
    unit?: string;
}

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, required } = questionItem;
    const { unit } = questionItem as NumericItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);

    if (linkId === 'bmi') {
        return <BMI text={text} value={value} unit={unit} />;
    }

    return (
        <Form.Item label={text} hidden={hidden}>
            <InputNumber
                addonAfter={unit}
                style={inputStyle}
                disabled={disabled}
                onChange={onChange}
                value={value}
                required={required}
            />
        </Form.Item>
    );
}

export function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const { unit } = questionItem as NumericItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];
    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item label={text} hidden={hidden}>
            <InputNumber
                addonAfter={unit}
                style={inputStyle}
                disabled={disabled}
                onChange={onChange}
                value={value}
            />
        </Form.Item>
    );
}
