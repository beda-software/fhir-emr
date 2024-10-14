
import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem, onBlur, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item {...formItem}>
            <Input value={value} disabled={disabled} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />
        </Form.Item>
    );
}

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, rowsNumber } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem, placeholder } = useFieldController(fieldName, questionItem);

    const [parts, setParts] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        const partsArray = value?.split(/<input[^>]*>/g).filter((part: string) => !!part) || [''];
        setParts(partsArray);

        const match = value?.match(/<input value="([^"]*)"/);
        setInputValue(match ? match[1] : '');
    }, [value]);

    const handleInputChange = (newInputValue: string) => {
        setInputValue(newInputValue);

        const updatedValue = value.replace(/<input[^>]*>/, `<input value="${newInputValue}"/>`);
        onChange(updatedValue);
    };

    return (
        <Form.Item {...formItem}>
            {!!parts.length && parts?.map((part, index) => (
                <React.Fragment key={index}>
                    {part}
                    {index < parts.length - 1 && (
                        <input
                            style={{ background: 'transparent' }}
                            type="text"
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Введите данные"
                        />
                    )}
                </React.Fragment>
            ))}
            <Input.TextArea
                value={value}
                rows={rowsNumber ?? 1}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}