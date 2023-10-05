import { Form } from 'antd';
import PhoneInput from 'antd-phone-input';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../../hooks';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const PhoneInputFixed: typeof PhoneInput = PhoneInput.default ? PhoneInput.default : PhoneInput;

export function QuestionPhone({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <PhoneInputFixed
                country="us"
                value={value}
                disabled={disabled}
                onChange={({ countryCode, areaCode, phoneNumber }) => {
                    onChange([countryCode, areaCode, phoneNumber].filter(Boolean).join(''));
                }}
            />
        </Form.Item>
    );
}
