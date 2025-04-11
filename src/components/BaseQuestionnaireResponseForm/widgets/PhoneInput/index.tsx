import { Form } from 'antd';
import classNames from 'classnames';
import { useContext, useState } from 'react';
import PI, { PhoneInputProps } from 'react-phone-input-2';
import { QuestionItemProps } from 'sdc-qrf';

import { PhoneInputCountryContext } from './context';
import { S } from './PhoneInput.styles';
import { useFieldController } from '../../hooks';

// https://github.com/bl00mber/react-phone-input-2/issues/533#issuecomment-1508211907
const PhoneInput: React.FC<PhoneInputProps> = (PI as any).default || PI;

export function QuestionPhone({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const defaultCountryCode = useContext(PhoneInputCountryContext);
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);
    const [focused, setFocused] = useState(false);

    return (
        <Form.Item {...formItem}>
            <S.Container>
                <PhoneInput
                    country={defaultCountryCode}
                    value={value}
                    onChange={(phone) => {
                        if (phone) {
                            onChange(`+${phone}`);
                        }
                    }}
                    disabled={disabled}
                    inputClass={'react-phone-input'}
                    containerClass={classNames({
                        _focused: focused,
                    })}
                    buttonClass={'react-phone-input__button'}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                />
            </S.Container>
        </Form.Item>
    );
}
