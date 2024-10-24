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

  if (parts.length > 2 || parts.length < 2) {
    return <Text>error</Text>
  }

  return (
    <span>
      {/* <Text>{parts[0]} </Text>
      <S.InputWrapper>
      <Input
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      </S.InputWrapper>

      <Text>{parts[1]} </Text> */}
      {parts.map((part, index) => {
        const inputRendered = index === 0;
        return (
          <React.Fragment key={index}>
            <Text>{part}</Text>
            {inputRendered && (
              <S.InputWrapper>
                <Input
                  value={value}
                  disabled={disabled}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={placeholder}
                />
              </S.InputWrapper>
            )}
          </React.Fragment>
        )
      })}
    </span>
  );
};

export default InputInsideText;
