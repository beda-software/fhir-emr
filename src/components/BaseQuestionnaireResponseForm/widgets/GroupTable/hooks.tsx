import { t } from '@lingui/macro';
import { Button, Popconfirm, Space } from 'antd';
import _ from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { FormItems, GroupItemProps, ItemContext, RepeatableFormGroupItems, populateItemKey } from 'sdc-qrf';
import { ITEM_KEY } from 'sdc-qrf/dist/utils';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { RenderFormItemReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/RenderFormItemReadOnly';

import { RepeatableGroupTableRow } from './types';

export function useGroupTable(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;
    const { linkId, item, repeats, text, hidden } = questionItem;

    const title = text ? text : linkId;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    const { onChange } = useFieldController<RepeatableFormGroupItems>(fieldName, questionItem);

    const { getValues, reset } = useFormContext<FormItems>();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

    const snapshotFullFormValuesRef = useRef<FieldValues | null>(null);
    const snapshotContextRef = useRef<ItemContext[] | null>(null);
    const [snapshotDataSource, setSnapshotDataSource] = useState<RepeatableGroupTableRow[] | null>(null);

    const fullFormValues = getValues();
    const formValues = useMemo(() => _.get(getValues(), fieldName), [getValues, fieldName]);

    const formItems: FormItems[] = useMemo(() => {
        return formValues?.items || [];
    }, [formValues?.items]);

    const fields = useMemo(
        () =>
            _.map(questionItem.item, (item) => {
                return item.linkId;
            }),
        [questionItem.item],
    );

    const dataSource: RepeatableGroupTableRow[] = useMemo(() => {
        if (fields.length === 0) {
            return [];
        }

        const dataSource = _.map(formItems, (item, index: number) => {
            const data: RepeatableGroupTableRow = fields.reduce((acc: any, curr: string) => {
                const questionnaireItem = questionItem.item?.find((qItem) => qItem.linkId === curr);
                acc[curr] = {
                    ...(curr in item
                        ? { formItem: item[curr], questionnaireItem: questionnaireItem ?? undefined }
                        : {}),
                    index: index,
                    linkId: curr,
                    itemKey: item[ITEM_KEY],
                };

                return acc;
            }, {});
            Object.assign(data, { key: item[ITEM_KEY] });
            return data;
        });

        return dataSource;
    }, [fields, formItems, questionItem.item]);

    const startEdit = useCallback(
        (index: number) => {
            snapshotFullFormValuesRef.current = _.cloneDeep(fullFormValues);
            snapshotContextRef.current = _.cloneDeep(context);
            setSnapshotDataSource(_.cloneDeep(dataSource));
            setEditIndex(index);
        },
        [context, dataSource, fullFormValues],
    );

    const handleOpen = useCallback(
        (index: number) => {
            startEdit(index);
            setIsModalVisible(true);
        },
        [startEdit],
    );

    const handleCancel = useCallback(() => {
        if (snapshotFullFormValuesRef.current) {
            reset(snapshotFullFormValuesRef.current, { keepDirty: true });
            onChange(snapshotFullFormValuesRef.current);
            snapshotFullFormValuesRef.current = null;
            snapshotContextRef.current = null;
            setSnapshotDataSource(null);
        }
        setIsModalVisible(false);
    }, [onChange, reset]);

    const handleSave = useCallback(() => {
        if (snapshotFullFormValuesRef.current) {
            snapshotFullFormValuesRef.current = null;
            snapshotContextRef.current = null;
            setSnapshotDataSource(null);
        }
        setIsModalVisible(false);
    }, []);

    const populateValue = (exisingItems: Array<any>) => [...exisingItems, {}].map(populateItemKey);

    const handleAdd = useCallback(() => {
        const updatedInput = { ...formValues, items: populateValue(formItems) };
        onChange(updatedInput);
        handleOpen(formItems.length);
    }, [formItems, formValues, onChange, handleOpen]);

    const handleDelete = useCallback(
        (index: number) => {
            const filteredArray = _.filter(formItems, (_val, valIndex: number) => valIndex !== index);
            onChange({
                items: [...filteredArray],
            });
        },
        [formItems, onChange],
    );

    const dataColumns = useMemo(() => {
        return _.map(item, (questionItem) => {
            return {
                title: questionItem.text ? questionItem.text : questionItem.linkId,
                dataIndex: questionItem.linkId,
                key: questionItem.linkId,
                render: (value: any) => (
                    <RenderFormItemReadOnly formItem={value.formItem} questionnaireItem={value.questionnaireItem} />
                ),
            };
        });
    }, [item]);

    const actionColumn = useMemo(() => {
        return {
            title: 'Actions',
            dataIndex: fields[0] ?? 'id',
            key: 'action',
            width: 180,
            render: (value: any) => {
                if (value?.index === undefined) {
                    return null;
                }
                return (
                    <Space>
                        <Button
                            type="link"
                            onClick={() => {
                                handleOpen(value?.index);
                            }}
                        >{t`Edit`}</Button>
                        <Popconfirm
                            title={t`Are you sure you want to delete this item?`}
                            onConfirm={() => handleDelete(value.index)}
                        >
                            <Button type="link" danger>{t`Delete`}</Button>
                        </Popconfirm>
                    </Space>
                );
            },
        };
    }, [fields, handleOpen, handleDelete]);

    const columns = useMemo(() => {
        return [...dataColumns, actionColumn];
    }, [actionColumn, dataColumns]);

    return {
        repeats,
        hidden,
        title,
        formValues,
        handleAdd,
        dataSource,
        columns,
        isModalVisible,
        editIndex,
        handleCancel,
        handleSave,
        snapshotDataSource,
    };
}
