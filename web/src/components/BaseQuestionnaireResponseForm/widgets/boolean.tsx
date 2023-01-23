import { Form, Checkbox } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

export function QuestionBoolean({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'boolean'];
    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item hidden={hidden} valuePropName="checked">
            <Checkbox disabled={disabled} onChange={onChange} checked={value}>
                {text}
            </Checkbox>
        </Form.Item>
    );
}
