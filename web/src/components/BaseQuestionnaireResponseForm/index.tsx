import { Input, Form, InputNumber, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

import {
    calcInitialContext,
    GroupItemProps,
    QuestionItemProps,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
    useQuestionnaireResponseFormContext,
} from 'shared/src/utils/qrf';

interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
}

export function BaseQuestionnaireResponseForm({ formData, onSubmit, readOnly }: Props) {
    const [form] = Form.useForm();

    return (
        <Form
            layout="vertical"
            form={form}
            initialValues={formData.formValues}
            onFinish={(values) => onSubmit({ ...formData, formValues: values })}
        >
            {() => {
                const formValues = form.getFieldsValue();

                return (
                    <QuestionnaireResponseFormProvider
                        formValues={formValues}
                        setFormValues={form.setFieldsValue}
                        groupItemComponent={Group}
                        questionItemComponents={{
                            text: QuestionText,
                            string: QuestionString,
                            decimal: QuestionDecimal,
                            integer: QuestionInteger,
                            date: QuestionDateTime,
                            dateTime: QuestionDateTime,
                            time: QuestionDateTime,
                        }}
                        readOnly={readOnly}
                    >
                        <>
                            <QuestionItems
                                questionItems={formData.context.questionnaire.item!}
                                parentPath={[]}
                                context={calcInitialContext(formData.context, formValues)}
                            />
                            {!readOnly && (
                                <Button type="primary" htmlType="submit">
                                    Отправить
                                </Button>
                            )}
                        </>
                    </QuestionnaireResponseFormProvider>
                );
            }}
        </Form>
    );
}

function Group({ parentPath, questionItem, context }: GroupItemProps) {
    const { linkId, text, item } = questionItem;
    const fieldName = [...parentPath, linkId, 'items'];

    return (
        <Form.Item label={<b>{text}</b>} name={fieldName}>
            <QuestionItems questionItems={item!} parentPath={fieldName} context={context[0]} />
        </Form.Item>
    );
}

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];

    return (
        <Form.Item label={text} name={fieldName}>
            <Input style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'text'];
    return (
        <Form.Item label={text} name={fieldName}>
            <TextArea rows={4} style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];

    return (
        <Form.Item label={text} name={fieldName}>
            <InputNumber style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];

    return (
        <Form.Item label={text} name={fieldName}>
            <InputNumber style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

export function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, type } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', type];

    return (
        <Form.Item label={text} name={fieldName}>
            <Input style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

const inputStyle = { backgroundColor: '#F7F9FC' };
