import { t } from '@lingui/macro';
import { Button, Popconfirm, Space } from 'antd';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItems, GroupItemProps, RepeatableFormGroupItems, populateItemKey } from 'sdc-qrf';
import { ITEM_KEY, isAnswerValueEmpty, toAnswerValue } from 'sdc-qrf/dist/utils';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { RenderFormItemReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/RenderFormItemReadOnly';

import { RepeatableGroupTableRow } from './types';

export function useGroupTable(props: GroupItemProps) {
    const { parentPath, questionItem } = props;
    const { linkId, repeats, text, hidden, item } = questionItem;

    const title = text ? text : linkId;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    const { onChange } = useFieldController<RepeatableFormGroupItems>(fieldName, questionItem);

    const { getValues, reset } = useFormContext<FormItems>();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

    const [snapshotFormValues, setSnapshotFormValues] = useState<FormItems[] | null>(null);
    const [snapshotDataSource, setSnapshotDataSource] = useState<RepeatableGroupTableRow[] | null>(null);

    const fullFormValues = getValues();
    const formValues = _.get(getValues(), fieldName);

    const visibleItem = useMemo(() => item?.filter((i) => !i.hidden), [item]);

    const formItems: FormItems[] = useMemo(() => {
        return formValues?.items || [];
    }, [formValues?.items]);

    const fields = useMemo(
        () =>
            _.map(visibleItem, (item) => {
                return item.linkId;
            }),
        [visibleItem],
    );

    const dataSource: RepeatableGroupTableRow[] = useMemo(() => {
        if (fields.length === 0) {
            return [];
        }

        if (!_.isArray(formItems)) {
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

        if (dataSource.length > 1) {
            return dataSource;
        } else if (dataSource.length === 1) {
            const innerItems = dataSource[0];
            if (!innerItems) {
                return [];
            }
            const isRowEmpty = Object.entries(innerItems).map(([, value]) => {
                if (!value.formItem) {
                    return true;
                }
                const answer = value.formItem ? toAnswerValue(value.formItem[0], 'value') : undefined;
                if (!answer) {
                    return true;
                }
                const isAnswerEmpty = isAnswerValueEmpty(answer);
                return isAnswerEmpty;
            });
            const rowIsEmpty = isRowEmpty.every((element) => element);

            return rowIsEmpty ? [] : dataSource;
        }

        return [];
    }, [fields, formItems, questionItem]);

    const startEdit = useCallback(
        (index: number) => {
            setSnapshotFormValues(_.cloneDeep(formValues));
            setSnapshotDataSource(_.cloneDeep(dataSource));
            setEditIndex(index);
        },
        [dataSource, formValues],
    );

    const handleOpen = useCallback(
        (index: number) => {
            startEdit(index);
            setIsModalVisible(true);
        },
        [startEdit],
    );

    const handleCancel = useCallback(() => {
        const currentFullFormValues = _.cloneDeep(getValues());
        _.set(currentFullFormValues, fieldName, _.cloneDeep(snapshotFormValues));
        reset(currentFullFormValues, { keepDirty: true });
        onChange({ items: snapshotFormValues });
        setSnapshotFormValues(null);
        setSnapshotDataSource(null);
        setEditIndex(undefined);
        setIsModalVisible(false);
    }, [fieldName, getValues, onChange, reset, snapshotFormValues]);

    const handleSave = useCallback(() => {
        setSnapshotFormValues(null);
        setSnapshotDataSource(null);
        reset(fullFormValues, { keepDirty: true });
        setIsModalVisible(false);
    }, [fullFormValues, reset]);

    const populateValue = (exisingItems: Array<any>) => [...exisingItems, {}].map(populateItemKey);

    const handleAdd = useCallback(() => {
        if (dataSource.length === 0 && formItems.length !== 0) {
            // This one case happens when the user deletes all items
            handleOpen(0);
        } else {
            const updatedInput = { ...formValues, items: populateValue(formItems) };
            const currentFullFormValues = _.cloneDeep(getValues());
            const updatedItems = populateValue(formItems);
            _.set(currentFullFormValues, fieldName, _.cloneDeep(updatedItems));
            onChange(updatedInput);
            handleOpen(formItems.length);
        }
    }, [dataSource, formItems, handleOpen, formValues, getValues, fieldName, onChange]);

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
        return _.map(visibleItem, (questionItem) => {
            return {
                title: questionItem.text ? questionItem.text : questionItem.linkId,
                dataIndex: questionItem.linkId,
                key: questionItem.linkId,
                render: (value: any) => (
                    <RenderFormItemReadOnly formItem={value.formItem} questionnaireItem={value.questionnaireItem} />
                ),
            };
        });
    }, [visibleItem]);

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
