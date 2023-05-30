import 'react-phone-input-2/lib/style.css';

import { Form } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { QuestionItemProps } from 'sdc-qrf';

import s from '../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../hooks';

export function QuestionPhone({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);
    const [focused, setFocused] = useState(false);

    return (
        <Form.Item {...formItem}>
            <PhoneInput
                country={'us'}
                value={value}
                onChange={(phone) => onChange(phone)}
                disabled={disabled}
                inputClass={s.phoneInput}
                containerClass={classNames({
                    _focused: focused,
                })}
                buttonClass={s.phoneButton}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </Form.Item>
    );
}
