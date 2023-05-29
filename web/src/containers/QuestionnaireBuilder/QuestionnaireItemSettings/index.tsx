import { Trans, t } from '@lingui/macro';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import { FormProvider, useForm } from 'react-hook-form';
import { QuestionItemProps } from 'sdc-qrf/lib/types';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import { itemControlSpecificFields, itemControls, typeSpecificFields } from './controls';
import { SettingsField } from './SettingsField';

const { Option } = Select;

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
    const controls = itemControls[item.questionItem.type];
    const type = formValues.type;
    const itemControlCode = formValues.itemControl?.coding?.[0]?.code;

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
                {controls && controls.length > 0 ? (
                    <>
                        <SettingsField name="itemControl.coding.0.code">
                            {({ field }) => (
                                <Form.Item label={t`Item Control`}>
                                    <Select allowClear onChange={field.onChange} value={field.value}>
                                        {controls.map((c) => (
                                            <Option value={c.code} key={`item-control-${c.code}`}>
                                                {c.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}
                        </SettingsField>
                        {itemControlCode ? itemControlSpecificFields[itemControlCode] : null}
                    </>
                ) : null}
                {type ? typeSpecificFields[type] : null}
                <Form.Item>
                    <Button htmlType="submit">
                        <Trans>Save</Trans>
                    </Button>
                </Form.Item>
            </form>
        </FormProvider>
    );
}
