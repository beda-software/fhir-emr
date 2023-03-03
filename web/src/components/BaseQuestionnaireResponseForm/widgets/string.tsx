import { Form, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, required } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, hidden, fieldState, onBlur } = useFieldController(
        fieldName,
        questionItem,
    );

    return (
        <Form.Item
            label={text}
            hidden={hidden}
            validateStatus={fieldState.invalid ? 'error' : 'success'}
            help={fieldState.invalid && `${text} is required`}
            required={required}
        >
            <Input
                value={value}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
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
