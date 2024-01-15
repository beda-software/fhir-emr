import { yupResolver } from '@hookform/resolvers/yup';
import { Trans, t } from '@lingui/macro';
import { Button, Form, Input, Select } from 'antd';
import { Questionnaire } from 'fhir/r4b';
import { useMemo } from 'react';
import { FormProvider, UseControllerReturn, useController, useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';

import { WithId } from '@beda.software/fhir-react';
import { RemoteDataResult, isSuccess } from '@beda.software/remote-data';

import { Title } from 'src/components/Typography';

import { prepareQuestionnaire } from './utils';

interface QuestionnaireSaveFormProps {
    questionnaire: Questionnaire;
    onSave: (questionnaire: Questionnaire) => Promise<RemoteDataResult<WithId<Questionnaire>>>;
    onSuccess?: () => void;
}
export function QuestionnaireSaveForm(props: QuestionnaireSaveFormProps) {
    const { questionnaire, onSave, onSuccess } = props;
    const schema = useMemo(() => yup.object<Partial<Questionnaire>>({ title: yup.string().required() }), []);
    const methods = useForm<Partial<Questionnaire>>({
        defaultValues: { ...questionnaire, status: questionnaire.status ? questionnaire.status : 'active' },
        resolver: yupResolver(schema),
        mode: 'onBlur',
    });
    const {
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = methods;
    const formValues = watch();

    return (
        <FormProvider {...methods}>
            <Form
                onFinish={handleSubmit(async () => {
                    const questionnaire = prepareQuestionnaire(formValues as Questionnaire);
                    const saveResponse = await onSave(questionnaire);
                    if (isSuccess(saveResponse) && onSuccess) {
                        onSuccess();
                    }
                })}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
            >
                <Title level={5} style={{ marginBottom: 16 }}>
                    <Trans>Questionnaire properties</Trans>
                </Title>
                <FieldWrapper name="title">
                    {({ field }) => (
                        <Form.Item label={t`Title`} rules={[{ required: true }]}>
                            <Input {...field} />
                            <p style={{ color: 'red' }}>{errors.title?.message}</p>
                        </Form.Item>
                    )}
                </FieldWrapper>
                <FieldWrapper name="subjectType">
                    {({ field }) => (
                        <Form.Item label={t`Subject Type`}>
                            <Select
                                {...field}
                                mode="multiple"
                                allowClear
                                options={[
                                    { value: 'Encounter', label: t`Encounter` },
                                    { value: 'Patient', label: t`Patient` },
                                ]}
                            />
                        </Form.Item>
                    )}
                </FieldWrapper>
                <FieldWrapper name="status">
                    {({ field }) => (
                        <Form.Item label={t`Status`}>
                            <Select
                                {...field}
                                options={[
                                    { value: 'draft', label: t`Draft` },
                                    { value: 'active', label: t`Active` },
                                ]}
                            />
                        </Form.Item>
                    )}
                </FieldWrapper>
                <Form.Item>
                    <Button htmlType="submit" loading={isSubmitting}>
                        <Trans>Save</Trans>
                    </Button>
                </Form.Item>
            </Form>
        </FormProvider>
    );
}

interface FieldWrapperProps {
    name: string;
    children: (props: UseControllerReturn) => React.ReactNode;
}
function FieldWrapper({ name, children }: FieldWrapperProps) {
    const props = useFieldController(name);

    return <>{children?.(props)}</>;
}

export function useFieldController(name: string): UseControllerReturn {
    const { control } = useFormContext();

    const result = useController({
        control: control,
        name,
    });

    return result;
}
