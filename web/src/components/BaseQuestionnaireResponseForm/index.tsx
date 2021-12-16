import { Input, Form, InputNumber } from 'antd';

import { setByPath } from 'shared/src/utils/path';
import {
    calcInitialContext,
    GroupItemProps,
    QuestionItemProps,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'shared/src/utils/qrf';

interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
}

export function BaseQuestionnaireResponseForm({ formData, onSubmit }: Props) {
    const [form] = Form.useForm();

    return (
        <Form
            form={form}
            initialValues={formData.formValues}
            onFinish={(values) => onSubmit({ ...formData, formValues: values })}
        >
            {() => {
                const formValues = form.getFieldsValue();

                return (
                    <QuestionnaireResponseFormProvider
                        formValues={formValues}
                        setFormValue={(name, value) =>
                            form.setFieldsValue(setByPath(formValues, name, value))
                        }
                        groupItemComponent={Group}
                        questionItemComponents={{
                            text: QuestionText,
                            string: QuestionText,
                            decimal: QuestionDecimal,
                            integer: QuestionInteger,
                        }}
                    >
                        <>
                            <QuestionItems
                                questionItems={formData.context.questionnaire.item!}
                                parentPath={[]}
                                context={calcInitialContext(formData.context, formValues)}
                            />
                            <input type="submit" value="Submit" />
                        </>
                    </QuestionnaireResponseFormProvider>
                );
            }}
        </Form>
    );
}

function Group(_props: GroupItemProps) {
    return null;
}

function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];

    return (
        <Form.Item label={text} name={fieldName}>
            <Input />
        </Form.Item>
    );
}

function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];

    return (
        <Form.Item label={text} name={fieldName}>
            <InputNumber />
        </Form.Item>
    );
}

function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];

    return (
        <Form.Item label={text} name={fieldName}>
            <InputNumber />
        </Form.Item>
    );
}
