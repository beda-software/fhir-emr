import { Form } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../../hooks';
import { S } from './PhoneInput.styles';

export function QuestionPhone({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);
    const [focused, setFocused] = useState(false);

    return (
        <Form.Item {...formItem}>
            <S.Container>
                <PhoneInput
                    country={'us'}
                    value={value}
                    onChange={(phone) => onChange(phone)}
                    disabled={disabled}
                    inputClass={'react-phone-input'}
                    containerClass={classNames({
                        _focused: focused,
                    })}
                    buttonClass={'react-phone-input__button'}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </S.Container>
        </Form.Item>
    );
}
