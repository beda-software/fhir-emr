import { Input } from 'antd';
import React from 'react';

import s from './InputInsideText.module.scss'

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

  let inputRendered = false;

  return (
    <span>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && !inputRendered ? (
            <>
              <Input
                value={value}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={s.input}
              />
              {inputRendered = true}
            </>
          ) : null}
        </React.Fragment>
      ))}
    </span>
  );
};

export default InputInsideText;
