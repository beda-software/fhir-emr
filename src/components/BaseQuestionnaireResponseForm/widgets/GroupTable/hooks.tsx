import { t } from '@lingui/macro';
import { Button, Popconfirm, Space } from 'antd';
import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItems, GroupItemProps, QuestionItems, RepeatableFormGroupItems, populateItemKey } from 'sdc-qrf';

import {
    ItemControlGroupItemReadonlyWidgetsContext,
    ItemControlQuestionItemReadonlyWidgetsContext,
} from 'src/components/BaseQuestionnaireResponseForm/context';
import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { RepeatableGroupTableRow } from './types';

export function useGroupTable(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;
    const { linkId, item, repeats, text, hidden } = questionItem;

    const ItemControlQuestionItemReadonlyWidgetsFromContext = useContext(ItemControlQuestionItemReadonlyWidgetsContext);
    const ItemControlGroupItemReadonlyWidgetsFromContext = useContext(ItemControlGroupItemReadonlyWidgetsContext);

    const title = text ? text : linkId;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    const { onChange } = useFieldController<RepeatableFormGroupItems>(fieldName, questionItem);

    const { getValues } = useFormContext();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

    const handleOpen = useCallback((index: number) => {
        setEditIndex(index);
        setIsModalVisible(true);
    }, []);

    const formValues = _.get(getValues(), fieldName);
    const formItems: FormItems[] = useMemo(() => {
        return formValues?.items || [];
    }, [formValues]);

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

        return _.map(formItems, (item, index: number) => {
            const data: RepeatableGroupTableRow = fields.reduce((acc: any, curr: string) => {
                acc[curr] = {
                    ...(curr in item ? item[curr]?.[index] : {}),
                    index: index,
                    linkId: curr,
                    itemKey: item._itemKey,
                };

                return acc;
            }, {});

            return data;
        });
    }, [fields, formItems]);

    const dataColumns = useMemo(() => {
        return _.map(item, (questionItem) => {
            return {
                title: questionItem.text ? questionItem.text : questionItem.linkId,
                dataIndex: questionItem.linkId,
                key: questionItem.linkId,
                render: (value: any) => {
                    if (value?.linkId === undefined) {
                        return null;
                    }
                    if (value.index !== undefined && value.index === undefined) {
                        return null;
                    }

                    const questionItem = item?.find((item) => item.linkId === value.linkId);
                    if (questionItem === undefined) {
                        return null;
                    }

                    const contextItem = context[value.index];
                    if (contextItem === undefined) {
                        return null;
                    }
                    return (
                        <>
                            {value?.linkId !== undefined && (
                                <QuestionItems
                                    key={`${fieldName.join()}-${value.itemKey}-${value.linkId}`}
                                    questionItems={[questionItem]}
                                    parentPath={[...parentPath, linkId, 'items', value.index.toString()]}
                                    context={contextItem}
                                />
                            )}
                        </>
                    );
                },
            };
        });
    }, [context, fieldName, item, linkId, parentPath]);

    const handleDelete = useCallback(
        (index: number) => {
            const filteredArray = _.filter(formItems, (_val, valIndex: number) => valIndex !== index);
            onChange({
                items: [...filteredArray],
            });
        },
        [formItems, onChange],
    );

    const actionColumn = useMemo(() => {
        return {
            title: 'Actions',
            dataIndex: fields[0] ?? 'id',
            key: 'action',
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

    const populateValue = (exisingItems: Array<any>) => [...exisingItems, {}].map(populateItemKey);

    const handleAdd = useCallback(() => {
        const updatedInput = { ...formValues, items: populateValue(formItems) };
        onChange(updatedInput);
        handleOpen(formItems.length);
    }, [formItems, formValues, onChange, handleOpen]);

    return {
        repeats,
        hidden,
        title,
        formValues,
        formItems,
        handleAdd,
        dataSource,
        columns,
        isModalVisible,
        setIsModalVisible,
        editIndex,
        onChange,
        ItemControlQuestionItemReadonlyWidgetsFromContext,
        ItemControlGroupItemReadonlyWidgetsFromContext,
    };
}
