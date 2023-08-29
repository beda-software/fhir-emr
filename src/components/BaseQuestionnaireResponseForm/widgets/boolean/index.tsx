import { Form, Checkbox } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../../hooks';

export function QuestionBoolean({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'boolean'];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem} valuePropName="checked" data-testid="question-boolean" label={undefined}>
            <Checkbox disabled={disabled} onChange={onChange} checked={value} data-testid="checkbox">
                {text}
            </Checkbox>
        </Form.Item>
    );
}
