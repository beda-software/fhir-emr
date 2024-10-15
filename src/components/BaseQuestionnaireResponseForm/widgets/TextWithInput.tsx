import { Input } from 'antd';
import React from 'react';

interface TextWithInputProps {
  text: string;
  onChangeInput: (value: string) => void;
}

const TextWithInput: React.FC<TextWithInputProps> = ({ text, onChangeInput }) => {
  const parts = text.split('<input/>');

  let inputRendered = false;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeInput(event.target.value);
  };

  return (
    <span>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && !inputRendered ? (
            <>
              <Input
                style={{ width: 200, margin: '0 10px' }}
                onChange={handleInputChange}
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
