import { Form, Input } from 'antd';
import { useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import TextWithInput from './TextWithInput';
import { useFieldController } from '../hooks';


export function QuestionInputString({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, formItem, onBlur, placeholder } = useFieldController(fieldName, questionItem);

        const [inputValue, setInputValue] = useState('');

        const handleInputChange = (inputValue: string) => {
            setInputValue(inputValue);
        };

        const handleComplete = () => {
            const fullText = (questionItem.text ?? '').replace('<input/>', inputValue);
            console.log("fullText:", fullText);
            onChange(fullText);

        };

    return (
        <Form.Item {...formItem} onBlur={handleComplete}  label={<TextWithInput  text={questionItem.text ?? ''} onChangeInput={handleInputChange} />}>
        </Form.Item>
    );
}

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

    return (
        <Form.Item {...formItem}>
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