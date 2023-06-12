import { Trans, t } from '@lingui/macro';
import { Button, Checkbox, Form, Input, Select, Popconfirm } from 'antd';
import Title from 'antd/lib/typography/Title';
import { FormProvider, useForm } from 'react-hook-form';
import { GroupItemProps, QuestionItemProps } from 'sdc-qrf/lib/types';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import { itemControlSpecificFields, itemControls, typeSpecificFields } from './controls';
import s from './QuestionnaireItemSettings.module.scss';
import { SettingsField } from './SettingsField';

const { Option } = Select;

interface Props {
    item: QuestionItemProps | GroupItemProps;
    onSave: (item: QuestionItemProps | GroupItemProps) => void;
    onDelete: (item: QuestionItemProps | GroupItemProps) => void;
}

export function QuestionnaireItemSettings(props: Props) {
    const { item, onSave, onDelete } = props;
    const methods = useForm<QuestionnaireItem>({
        defaultValues: item.questionItem,
    });
    const { handleSubmit, watch } = methods;
    const formValues = watch();
    const controls = itemControls[item.questionItem.type];
    const type = formValues.type;
    const itemControlCode = formValues.itemControl?.coding?.[0]?.code;

    const renderItemFields = () => {
        return (
            <>
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
            </>
        );
    };

    const renderGroupFields = () => {
        return (
            <>
                <SettingsField name="text">
                    {({ field }) => (
                        <Form.Item label={t`Text`}>
                            <Input.TextArea
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                rows={2}
                            />
                        </Form.Item>
                    )}
                </SettingsField>
            </>
        );
    };

    return (
        <FormProvider {...methods}>
            <Form
                onFinish={handleSubmit(async () => {
                    onSave({
                        ...item,
                        questionItem: formValues,
                    });
                })}
            >
                <Title level={5} style={{ marginBottom: 16 }}>
                    <Trans>Properties</Trans>
                </Title>
                {item.questionItem.type === 'group' ? renderGroupFields() : renderItemFields()}
                {controls && controls.length > 0 ? (
                    <>
                        <SettingsField name="itemControl.coding.0.code">
                            {({ field }) => (
                                <Form.Item label={t`Item Control`}>
                                    <Select
                                        allowClear
                                        onChange={(v) => {
                                            if (!v) {
                                                field.onChange(undefined);
                                            } else {
                                                field.onChange(v);
                                            }
                                        }}
                                        value={field.value}
                                        defaultValue={controls.filter((c) => c.default)}
                                    >
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
                <div className={s.buttons}>
                    <Button htmlType="submit" type="primary" ghost>
                        <Trans>Save</Trans>
                    </Button>
                    <Popconfirm
                        title="Delete Questionnaire Item"
                        description="Are you sure you want to delete this item?"
                        onConfirm={() => onDelete(item)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button htmlType="button" danger>
                            <Trans>Delete</Trans>
                        </Button>
                    </Popconfirm>
                </div>
            </Form>
        </FormProvider>
    );
}
