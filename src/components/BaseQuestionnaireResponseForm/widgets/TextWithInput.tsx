import { Input } from 'antd';
import React from 'react';

interface TextWithInputProps {
  value: string;
  disabled: boolean | undefined;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (value: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  placeholder: string | undefined;
}

const TextWithInput: React.FC<TextWithInputProps> = ({ text,  value, disabled, onChange, onBlur, placeholder }) => {
  const parts = text.split('<input/>');

  let inputRendered = false;

  return (
    <span>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && !inputRendered ? (
            <>
              <Input
                value={value} disabled={disabled} onChange={onChange} onBlur={onBlur} placeholder={placeholder}
                style={{ width: 200, margin: '0 10px' }}
              />
              {inputRendered = true}
            </>
          ) : (
            index < parts.length - 1 && '<input/>'
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

export default TextWithInput;
