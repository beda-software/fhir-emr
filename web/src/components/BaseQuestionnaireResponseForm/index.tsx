import { Trans } from '@lingui/macro';
import { Button, DatePicker, Form, Input, InputNumber, Select as ANTDSelect } from 'antd';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';
import TextArea from 'antd/lib/input/TextArea';
import { isArray } from 'lodash';
import moment, { Moment } from 'moment';
import { useCallback, useMemo, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import Select from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';
import {
    calcInitialContext,
    CustomWidgetsMapping,
    GroupItemProps,
    QuestionItemProps,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
    useQuestionnaireResponseFormContext,
} from 'sdc-qrf';

import 'react-phone-input-2/lib/style.css';
import { formatFHIRDate, formatFHIRDateTime } from 'aidbox-react/lib/utils/date';

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
                    phoneWidget: QuestionPhoneWidget,
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

type DateTimePickerWrapperProps = PickerProps<moment.Moment> & { type: string };

export function DateTimePickerWrapper({ value, onChange, type }: DateTimePickerWrapperProps) {
    const newValue = useMemo(() => (value ? moment(value) : value), [value]);
    const format = type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';
    const showTime = type === 'date' ? false : true;
    const formatFunction = type === 'date' ? formatFHIRDate : formatFHIRDateTime;

    const newOnChange = useCallback(
        (value: Moment | null, dateString: string) => {
            if (value) {
                value.toJSON = () => {
                    return formatFunction(value);
                };
            }
            onChange && onChange(value, dateString);
        },
        [onChange],
    );
    return (
        <DatePicker showTime={showTime} onChange={newOnChange} format={format} value={newValue} />
    );
}

export function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, type, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', type];
    return (
        <Form.Item label={text} name={fieldName} hidden={hidden || qrfContext.readOnly}>
            <DateTimePickerWrapper type={type} />
        </Form.Item>
    );
}

export function QuestionPhoneWidget({ parentPath, questionItem }: QuestionItemProps) {
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

export function QuestionSelectWrapper({
    value,
    onChange,
    options,
    isMulti,
}: StateManagerProps<any>) {
    const newValue = useMemo(() => {
        if (value) {
            if (isArray(value)) {
                return value.map((answerItem: any) => ({
                    label: answerItem.value.Coding.display,
                    value: answerItem.value,
                }));
            }
            return {
                label: value.value.Coding.display,
                value: value.value,
            };
        } else {
            return [];
        }
    }, [value]);
    const newOnChange = useCallback(
        (values: any, option: any) => {
            onChange && onChange(values, option);
        },
        [onChange],
    );
    if (isMulti) {
        return (
            <Select
                isMulti
                options={options?.map((c: any) => {
                    return {
                        label: c.value?.Coding.display,
                        value: c.value,
                    };
                })}
                onChange={newOnChange}
                value={newValue}
            />
        );
    }

    return (
        <Select
            options={options?.map((c: any) => {
                return {
                    label: c.value?.Coding.display,
                    value: c.value,
                };
            })}
            onChange={newOnChange}
            value={newValue}
        />
    );
}

class Option {}

interface ChoiceQuestionSelectProps {
    value: any;
    onChange: (option: Option | null) => void;
    options: any;
}

function ChoiceQuestionSelect(props: ChoiceQuestionSelectProps) {
    const { value, onChange, options } = props;

    const selectOptions = options?.map((c: any) => {
        return {
            label: c.value?.Coding.display,
            value: c.value,
        };
    });

    const newOnChange = (selectValue: any) => {
        onChange(selectValue.value);
    };

    const selectValue = {
        label: value?.Coding.display,
        value,
    };

    return (
        <>
            <Select options={selectOptions} onChange={newOnChange} value={selectValue} />
        </>
    );
}

function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, answerOption, readOnly, hidden, repeats } = questionItem;

    if (answerOption?.[0]?.value?.Coding) {
        const fieldName = repeats ? [...parentPath, linkId] : [...parentPath, linkId, 0, 'value'];

        return (
            <Form.Item label={text} name={fieldName} hidden={hidden}>
                <ChoiceQuestionSelect options={answerOption} />
                {/*<QuestionSelectWrapper isMulti={repeats} options={children} />*/}
            </Form.Item>
        );
    }

    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    return (
        <Form.Item label={text} name={fieldName}>
            <ANTDSelect style={inputStyle} disabled={readOnly || qrfContext.readOnly}>
                {answerOption?.map((answerOption) => (
                    <ANTDSelect.Option
                        label={answerOption.value!.string!}
                        value={answerOption.value!.string!}
                    >
                        {answerOption.value!.string!}
                    </ANTDSelect.Option>
                ))}
            </ANTDSelect>
        </Form.Item>
    );
}

const inputStyle = { backgroundColor: '#F7F9FC' };
