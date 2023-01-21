import { Form, Checkbox } from 'antd';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

export function QuestionBoolean({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'boolean'];

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden} valuePropName="checked">
            <Checkbox disabled={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}
