import { QuestionItemProps, useQuestionnaireResponseFormContext } from "sdc-qrf";
import { Form } from 'antd';

import 'react-phone-input-2/lib/style.css';

import { useState } from "react";
import PhoneInput from 'react-phone-input-2';

export function QuestionPhone({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <PhoneInput
                country={'us'}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                disabled={readOnly || qrfContext.readOnly}
            />
        </Form.Item>
    );
}

