import { Trans } from '@lingui/macro';
import { Button, Form } from 'antd';
import {
    calcInitialContext,
    CustomWidgetsMapping,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';

import 'react-phone-input-2/lib/style.css';
import {
    Group,
    QuestionChoice,
    QuestionDateTime,
    QuestionDecimal,
    QuestionInteger,
    QuestionPhone,
    QuestionSlider,
    QuestionSolidRadio,
    QuestionString,
    QuestionText,
} from './widgets';

interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
    customWidgets?: CustomWidgetsMapping;
}

export function BaseQuestionnaireResponseForm({
    formData,
    onSubmit,
    readOnly,
    customWidgets,
}: Props) {
    const [form] = Form.useForm();
    const formValues = form.getFieldsValue();
    return (
        <Form
            layout="vertical"
            form={form}
            initialValues={formData.formValues}
            onFinish={(values) => onSubmit({ ...formData, formValues: values })}
        >
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
                    choice: QuestionChoice,
                }}
                itemControlQuestionItemComponents={{
                    phoneWidget: QuestionPhone,
                    slider: QuestionSlider,
                    'solid-radio-button': QuestionSolidRadio,
                }}
                readOnly={readOnly}
                customWidgets={customWidgets}
            >
                <>
                    <QuestionItems
                        questionItems={formData.context.questionnaire.item!}
                        parentPath={[]}
                        context={calcInitialContext(formData.context, formValues)}
                    />
                    {!readOnly && (
                        <Button type="primary" htmlType="submit">
                            <Trans>Send</Trans>
                        </Button>
                    )}
                </>
            </QuestionnaireResponseFormProvider>
        </Form>
    );
}
