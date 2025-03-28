import { Trans, t } from '@lingui/macro';
import { Button, Checkbox, Form, Input, Select, Popconfirm } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { GroupItemProps, QuestionItemProps } from 'sdc-qrf';

import { QuestionnaireItem } from '@beda.software/aidbox-types';

import { Title } from 'src/components/Typography';

import { itemControlSpecificFields, getItemControls, typeSpecificFields } from './controls';
import { S } from './QuestionnaireItemSettings.styles';
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
    const controls = getItemControls()[item.questionItem.type];
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
                <S.Buttons>
                    <Button htmlType="submit" type="primary" ghost>
                        <Trans>Save</Trans>
                    </Button>
                    <Popconfirm
                        title={t`Delete Questionnaire Item`}
                        description={t`Are you sure you want to delete this item?`}
                        onConfirm={() => onDelete(item)}
                        okText={t`Yes`}
                        cancelText={t`No`}
                    >
                        <Button htmlType="button" danger>
                            <Trans>Delete</Trans>
                        </Button>
                    </Popconfirm>
                </S.Buttons>
            </Form>
        </FormProvider>
    );
}
