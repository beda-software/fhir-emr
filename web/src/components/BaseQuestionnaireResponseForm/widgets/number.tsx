import { Form, InputNumber } from 'antd';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

const inputStyle = { backgroundColor: '#F7F9FC' };

interface NumericItem {
    unit?: string;
}

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const { unit } = questionItem as NumericItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <InputNumber
                addonAfter={unit}
                style={inputStyle}
                readOnly={readOnly || qrfContext.readOnly}
            />
        </Form.Item>
    );
}

export function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const { unit } = questionItem as NumericItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <InputNumber
                addonAfter={unit}
                style={inputStyle}
                readOnly={readOnly || qrfContext.readOnly}
            />
        </Form.Item>
    );
}
