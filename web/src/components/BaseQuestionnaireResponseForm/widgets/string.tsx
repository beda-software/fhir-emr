import { Form, Input } from 'antd';
import { Rule } from 'antd/es/form';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, required } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);
    const [touched, setTouched] = useState(false);

    const rules: Rule[] = [];

    if (required) {
        rules.push({
            required: true,
            message: `Please input ${linkId}!`,
        });
    }

    const validateStatus =
        touched && required && (!value || String(value).trim() === '') ? 'error' : '';

    return (
        <Form.Item
            label={text}
            hidden={hidden}
            validateStatus={validateStatus}
            help={validateStatus === 'error' && `${text} is required`}
            required={required}
            rules={rules}
        >
            <Input
                value={value}
                disabled={disabled}
                onChange={onChange}
                onBlur={() => setTouched(true)}
            />
        </Form.Item>
    );
}

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item label={text} hidden={hidden}>
            <TextArea value={value} rows={1} disabled={disabled} onChange={onChange} />
        </Form.Item>
    );
}
