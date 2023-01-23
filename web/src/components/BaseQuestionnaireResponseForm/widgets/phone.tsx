import 'react-phone-input-2/lib/style.css';

import { Form } from 'antd';
import PhoneInput from 'react-phone-input-2';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

export function QuestionPhone({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item label={text} hidden={hidden}>
            <PhoneInput
                country={'us'}
                value={value}
                onChange={(phone) => onChange(phone)}
                disabled={disabled}
            />
        </Form.Item>
    );
}
