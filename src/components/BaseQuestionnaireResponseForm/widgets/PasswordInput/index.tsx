import { Form, Input } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../../hooks';

export function PasswordInput({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem, onBlur } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <Input.Password value={value} disabled={disabled} onChange={onChange} onBlur={onBlur} />
        </Form.Item>
    );
}
