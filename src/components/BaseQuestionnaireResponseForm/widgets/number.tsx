import { Form, InputNumber } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { Coding } from 'shared/src/contrib/aidbox';

import { useFieldController } from '../hooks';

const inputStyle = { width: '100%' };

interface NumericItem {
    unit?: Coding;
}

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, required } = questionItem;
    const { unit } = questionItem as NumericItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <InputNumber
                addonAfter={unit?.display}
                style={inputStyle}
                disabled={disabled}
                onChange={onChange}
                value={value}
                required={required}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

export function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const { unit } = questionItem as NumericItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <InputNumber
                addonAfter={unit?.display}
                style={inputStyle}
                disabled={disabled}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}
