import { Trans } from '@lingui/macro';
import { Input, Form, InputNumber, Button, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import {
    calcInitialContext,
    GroupItemProps,
    QuestionItemProps,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
    useQuestionnaireResponseFormContext,
} from 'sdc-qrf';

import 'react-phone-input-2/lib/style.css';

interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
}

export function BaseQuestionnaireResponseForm({ formData, onSubmit, readOnly }: Props) {
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
                    phoneNumber: QuestionPhoneNumber,
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
                            <Trans>Send</Trans>
                        </Button>
                    )}
                </>
            </QuestionnaireResponseFormProvider>
        </Form>
    );
}

function Group({ parentPath, questionItem, context }: GroupItemProps) {
    const { linkId, text, item, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 'items'];

    return (
        <Form.Item label={<b>{text}</b>} name={fieldName} hidden={hidden}>
            <QuestionItems questionItems={item!} parentPath={fieldName} context={context[0]} />
        </Form.Item>
    );
}

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <Input style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'text'];
    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <TextArea rows={4} style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <InputNumber style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <InputNumber style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

export function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, type, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', type];

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <Input style={inputStyle} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, repeats, answerOption, answerValueSet, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];

    if (repeats) {
        return <div>Unsupported repeated choice</div>;
    }

    if (!answerOption?.[0]?.value?.string) {
        return <div>Unsupported option type</div>;
    }

    if (answerValueSet) {
        return <div>Unsupported option type</div>;
    }

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <Select style={inputStyle} disabled={readOnly || qrfContext.readOnly}>
                {answerOption?.map((answerOption) => (
                    <Select.Option
                        key={answerOption.value!.string!}
                        value={answerOption.value!.string!}
                    >
                        {answerOption.value!.string!}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );
}

export function QuestionPhoneNumber({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <Form.Item label={text} name={fieldName} hidden={hidden}>
            <PhoneInput
                country={'us'}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                disabled={readOnly || qrfContext.readOnly}
            />
        </Form.Item>
    );
}

const inputStyle = { backgroundColor: '#F7F9FC' };
