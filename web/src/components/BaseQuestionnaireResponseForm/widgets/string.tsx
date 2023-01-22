import { Form, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <Input readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <TextArea rows={1} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}
