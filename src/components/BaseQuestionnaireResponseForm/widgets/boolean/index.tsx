import { Form, Checkbox } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { S } from './styles';
import { useFieldController } from '../../hooks';

export function QuestionBoolean({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'boolean'];
    const { value, onChange, disabled, formItem, onBlur } = useFieldController<boolean>(fieldName, questionItem);

    const hasError = formItem.validateStatus === 'error';

    return (
        <Form.Item
            {...formItem}
            valuePropName="checked"
            data-testid="question-boolean"
            data-linkid={linkId}
            label={undefined}
        >
            <S.CheckboxWrapper $hasError={hasError}>
                <Checkbox
                    disabled={disabled}
                    onChange={onChange}
                    checked={value}
                    data-testid="checkbox"
                    onBlur={onBlur}
                >
                    {text}
                </Checkbox>
            </S.CheckboxWrapper>
        </Form.Item>
    );
}
