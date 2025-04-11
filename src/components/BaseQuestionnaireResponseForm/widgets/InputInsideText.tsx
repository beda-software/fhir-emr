import { Input } from 'antd';
import React from 'react';

import { Text } from 'src/components/Typography';

import { S } from './InputInsideText.styles';

interface InputInsideTextProps {
    value: string;
    disabled: boolean | undefined;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (value: React.ChangeEvent<HTMLInputElement>) => void;
    text: string;
    placeholder: string | undefined;
}

const InputInsideText: React.FC<InputInsideTextProps> = ({ text, value, disabled, onChange, onBlur, placeholder }) => {
    const parts = text.split('<input/>');

    if (parts.length !== 2) {
        return <Text>Error: Invalid input format</Text>;
    }
    const [before, after] = parts;

    return (
        <span>
            <Text>{before}</Text>
            <S.InputWrapper>
                <Input
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                />
            </S.InputWrapper>
            <Text>{after}</Text>
        </span>
    );
};

export default InputInsideText;
