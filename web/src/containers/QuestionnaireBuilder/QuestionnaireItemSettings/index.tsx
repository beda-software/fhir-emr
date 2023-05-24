import { Trans, t } from '@lingui/macro';
import { Button, Checkbox, Form, Input } from 'antd';
import Title from 'antd/lib/typography/Title';
import { FormProvider, UseControllerReturn, useController, useForm, useFormContext } from 'react-hook-form';
import { QuestionItemProps } from 'sdc-qrf/lib/types';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

interface Props {
    item: QuestionItemProps;
    onSave: (item: QuestionItemProps) => void;
}

export function QuestionnaireItemSettings(props: Props) {
    const { item, onSave } = props;
    const methods = useForm<QuestionnaireItem>({
        defaultValues: item.questionItem,
    });
    const { handleSubmit, watch } = methods;
    const formValues = watch();

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(async () => {
                    onSave({
                        ...item,
                        questionItem: formValues,
                    });
                })}
            >
                <Title level={5} style={{ marginBottom: 16 }}>
                    <Trans>Properties</Trans>
                </Title>
                <SettingsField name="text">
                    {({ field }) => (
                        <Form.Item label={t`Label`}>
                            <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                        </Form.Item>
                    )}
                </SettingsField>
                <SettingsField name="required">
                    {({ field }) => (
                        <Form.Item valuePropName="checked">
                            <Checkbox onChange={field.onChange} checked={field.value}>
                                <Trans>Required</Trans>
                            </Checkbox>
                        </Form.Item>
                    )}
                </SettingsField>
                <SettingsField name="repeats">
                    {({ field }) => (
                        <Form.Item valuePropName="checked">
                            <Checkbox onChange={field.onChange} checked={field.value}>
                                <Trans>Repeats</Trans>
                            </Checkbox>
                        </Form.Item>
                    )}
                </SettingsField>
                <Form.Item>
                    <Button htmlType="submit">
                        <Trans>Save</Trans>
                    </Button>
                </Form.Item>
            </form>
        </FormProvider>
    );
}

interface SettingsFieldProps {
    name: string;
    children: (props: UseControllerReturn) => React.ReactNode;
}

function SettingsField({ name, children }: SettingsFieldProps) {
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
