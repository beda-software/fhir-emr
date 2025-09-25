import { Form, Input } from 'antd';
import { ChangeEvent } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { useDebouncedInput } from 'src/utils';

import { useFieldController } from '../hooks';

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { onChange, disabled, formItem, onBlur, placeholder } = useFieldController<string>(fieldName, questionItem);

    const { valueInput, handleChange } = useDebouncedInput<string, ChangeEvent<HTMLInputElement>>({
        onChange,
        getValue: (event: ChangeEvent<HTMLInputElement>) => event.target.value,
        initialValue: formItem.initialValue ?? '',
    });

    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <Input
                value={valueInput}
                disabled={disabled}
                onChange={handleChange}
                onBlur={onBlur}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}
export function QuestionEmail({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { onChange, disabled, formItem, onBlur, placeholder } = useFieldController<string>(fieldName, questionItem);

    const { valueInput, handleChange } = useDebouncedInput<string, ChangeEvent<HTMLInputElement>>({
        onChange,
        getValue: (event: ChangeEvent<HTMLInputElement>) => event.target.value,
        initialValue: formItem.initialValue ?? '',
    });

    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <Input
                value={valueInput}
                disabled={disabled}
                onChange={handleChange}
                onBlur={onBlur}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, rowsNumber = 3 } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { onChange, disabled, formItem, placeholder } = useFieldController<string>(fieldName, questionItem);

    const { valueInput, handleChange } = useDebouncedInput<string, ChangeEvent<HTMLTextAreaElement>>({
        onChange,
        getValue: (event: ChangeEvent<HTMLTextAreaElement>) => event.target.value,
        initialValue: formItem.initialValue ?? '',
    });

    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <Input.TextArea
                value={valueInput}
                rows={rowsNumber}
                disabled={disabled}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}
