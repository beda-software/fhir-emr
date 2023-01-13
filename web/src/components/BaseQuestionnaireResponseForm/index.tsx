import { Trans } from '@lingui/macro';
import { Button, Form } from 'antd';
import { useState } from 'react';
import {
    calcInitialContext,
    CustomWidgetsMapping,
    GroupItemComponent,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponentMapping,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';

import 'react-phone-input-2/lib/style.css';
import s from './BaseQuestionnaireResponseForm.module.scss';
import {
    Col,
    Group,
    InlineChoice,
    PairInput,
    QuestionBoolean,
    QuestionChoice,
    QuestionDateTime,
    QuestionDecimal,
    QuestionInteger,
    QuestionPhone,
    QuestionSlider,
    QuestionSolidRadio,
    QuestionString,
    QuestionText,
    Row,
} from './widgets';
import { Display } from './widgets/display';

export interface BaseQuestionnaireResponseFormProps {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
    customWidgets?: CustomWidgetsMapping;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    questionItemComponents?: QuestionItemComponentMapping;
    groupItemComponent?: GroupItemComponent;
}

export function BaseQuestionnaireResponseForm(props: BaseQuestionnaireResponseFormProps) {
    const { formData, onSubmit, readOnly } = props;
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState(formData.formValues);

    return (
        <Form
            layout="vertical"
            form={form}
            initialValues={formData.formValues}
            onFinish={(values) => onSubmit({ ...formData, formValues: values })}
            className={s.form}
            onValuesChange={(changedValues, values) => setFormValues(values)}
        >
            <QuestionnaireResponseFormProvider
                formValues={formData.formValues}
                setFormValues={form.setFieldsValue}
                groupItemComponent={Group}
                itemControlGroupItemComponents={{
                    col: Col,
                    row: Row,
                    'pair-input': PairInput,
                    ...props.itemControlGroupItemComponents,
                }}
                questionItemComponents={{
                    text: QuestionText,
                    string: QuestionString,
                    decimal: QuestionDecimal,
                    integer: QuestionInteger,
                    date: QuestionDateTime,
                    dateTime: QuestionDateTime,
                    time: QuestionDateTime,
                    choice: QuestionChoice,
                    boolean: QuestionBoolean,
                    display: Display,
                    ...props.questionItemComponents,
                }}
                itemControlQuestionItemComponents={{
                    phoneWidget: QuestionPhone,
                    slider: QuestionSlider,
                    'solid-radio-button': QuestionSolidRadio,
                    'inline-choice': InlineChoice,
                    ...props.itemControlQuestionItemComponents,
                }}
                readOnly={readOnly}
                customWidgets={props.customWidgets}
            >
                <>
                    <QuestionItems
                        questionItems={formData.context.questionnaire.item!}
                        parentPath={[]}
                        context={calcInitialContext(formData.context, formValues)}
                    />

                    {!readOnly && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="primary" htmlType="submit">
                                <Trans>Save</Trans>
                            </Button>
                        </div>
                    )}
                </>
            </QuestionnaireResponseFormProvider>
        </Form>
    );
}
