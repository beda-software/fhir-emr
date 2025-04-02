import { Form, Input } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem, onBlur, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <Input value={value} disabled={disabled} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />
        </Form.Item>
    );
}
export function QuestionEmail({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem, onBlur, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <Input
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value.trim())}
                onBlur={onBlur}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, rowsNumber = 3 } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <Input.TextArea
                value={value}
                rows={rowsNumber}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}
