import { QuestionItemProps } from 'sdc-qrf';

import InputInsideText from './InputInsideText';
import { useFieldController } from '../hooks';

export function QuestionInputInsideText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, onChange, disabled, onBlur, placeholder } = useFieldController(fieldName, questionItem);

    return (
        <InputInsideText
            value={value}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            text={questionItem.text ?? ''}
        />
    );
}
