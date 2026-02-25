import { t } from '@lingui/macro';
import { Button, Popconfirm, Space } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FCEQuestionnaireItem, FormItems, GroupItemProps, RepeatableFormGroupItems, populateItemKey } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { RenderFormItemReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/RenderFormItemReadOnly';
import { ColumnFilterValue, SearchBarColumn } from 'src/components/SearchBar/types';
import { TableFilter } from 'src/components/Table/TableFilter';

import { GroupTableRow } from './types';
import {
    createColumnFilterValue,
    getDataSource,
    getSearchBarColumnType,
    getGroupSorter,
    isColumnTypeArray,
    isTableItemMatchesFilter,
} from './utils';

export function useGroupTableFilter() {
    const [filterValueMap, setFilterValueMap] = useState<Record<string, ColumnFilterValue>>({});

    const handleFilterChange = useCallback(
        (value: ColumnFilterValue['value'], key: string, filter: ColumnFilterValue) => {
            setFilterValueMap((prev: Record<string, ColumnFilterValue>) => {
                if (value && !_.isEmpty(value)) {
                    return {
                        ...prev,
                        [key]: {
                            ...filter,
                            value,
                        },
                    } as Record<string, ColumnFilterValue>;
                }
                return _.omit(prev, key);
            });
        },
        [],
    );

    const getFilters = useCallback((questionItem: FCEQuestionnaireItem): Record<string, SearchBarColumn> => {
        const items = questionItem.item || [];
        const filters = _.reduce(
            items,
            (acc, item) => {
                if (!item.enableFiltering) {
                    return acc;
                }
                const filterKey = item.linkId;
                const column = getSearchBarColumnType(item);
                acc[filterKey] = column;
                return acc;
            },
            {} as Record<string, SearchBarColumn>,
        );
        return filters;
    }, []);

    const populateColumnWithFilters = useCallback(
        (columns: ColumnsType<GroupTableRow>, questionItem: FCEQuestionnaireItem): ColumnType<GroupTableRow>[] => {
            const enableFilters = getFilters(questionItem);
            if (_.isEmpty(enableFilters || !isColumnTypeArray(columns))) {
                return columns;
            }

            return columns.map((column) => {
                const linkId = column.key!;
                const searchBarColumn = enableFilters[linkId];
                if (!searchBarColumn) {
                    return column;
                }
                const filter = createColumnFilterValue(searchBarColumn);
                const filterValue = filterValueMap[linkId];

                const filterDropdown = filter
                    ? (props: FilterDropdownProps) => (
                          <TableFilter
                              {...props}
                              filter={filter}
                              onChange={(value, key) => handleFilterChange(value, key, filter)}
                          />
                      )
                    : undefined;
                const filtered = !!filterValueMap[linkId]?.value;
                const filteredValue: ColumnType<GroupTableRow>['filteredValue'] = filterValue ? [linkId] : [];
                const onFilter: ColumnType<GroupTableRow>['onFilter'] = (value, record) => {
                    if (!_.isString(value)) {
                        return true;
                    }
                    const filterValue = filterValueMap[value];
                    const item = record[linkId];
                    return isTableItemMatchesFilter(item, filterValue);
                };

                const columnWithFilters: ColumnType<GroupTableRow> = {
                    ...column,
                    filterDropdown,
                    filtered,
                    filteredValue,
                    onFilter,
                };
                return columnWithFilters;
            });
        },
        [filterValueMap, getFilters, handleFilterChange],
    );

    return {
        populateColumnWithFilters,
    };
}

export function useGroupTableSorter() {
    const getEnabledSorters = (questionItem: FCEQuestionnaireItem): Record<string, boolean> => {
        const items = questionItem.item || [];
        const sorters = _.reduce(
            items,
            (acc, item) => {
                if (!item.enableSort) {
                    return acc;
                }
                const sorterKey = item.linkId;
                acc[sorterKey] = true;
                return acc;
            },
            {} as Record<string, boolean>,
        );
        return sorters;
    };

    const getDefaultSortOrder = (questionItem: FCEQuestionnaireItem, linkId: string) => {
        const defaultSortLinkId = questionItem.defaultSort?.linkId;
        const defaultSort = questionItem.defaultSort?.sort;
        if (!defaultSortLinkId || defaultSortLinkId !== linkId || !defaultSort) {
            return undefined;
        }
        if (defaultSort === 'asc') {
            return 'ascend';
        }
        return 'descend';
    };

    const populateColumnWithSorters = useCallback(
        (columns: ColumnsType<GroupTableRow>, questionItem: FCEQuestionnaireItem): ColumnType<GroupTableRow>[] => {
            const enableSorters = getEnabledSorters(questionItem);
            if (_.isEmpty(enableSorters || !isColumnTypeArray(columns))) {
                return columns;
            }

            return columns.map((column) => {
                const linkId = column.key!.toString();
                const enableSorter = enableSorters[linkId];
                if (enableSorter !== true) {
                    return column;
                }
                const sorter: ColumnType<GroupTableRow>['sorter'] = getGroupSorter(questionItem, linkId);
                const defaultSortOrder = getDefaultSortOrder(questionItem, linkId);
                const columnWithSorters: ColumnType<GroupTableRow> = {
                    ...column,
                    sorter: sorter,
                    ...(defaultSortOrder ? { defaultSortOrder: defaultSortOrder } : {}),
                };
                return columnWithSorters;
            });
        },
        [],
    );

    return {
        populateColumnWithSorters,
    };
}

export function useGroupTable(props: GroupItemProps) {
    const { parentPath, questionItem } = props;
    const { linkId, repeats, text, hidden, item } = questionItem;

    const title = text ? text : linkId;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    const chartLinkIdX = questionItem.enableChart?.linkIdX;
    const chartLinkIdY = questionItem.enableChart?.linkIdY;

    const { onChange } = useFieldController<RepeatableFormGroupItems>(fieldName, questionItem);

    const { getValues, reset } = useFormContext<FormItems>();

    const [renderAsTable, setRenderAsTable] = useState<boolean>(!chartLinkIdX && !chartLinkIdY);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

    const [snapshotFormValues, setSnapshotFormValues] = useState<FormItems[] | null>(null);
    const [snapshotDataSource, setSnapshotDataSource] = useState<GroupTableRow[] | null>(null);

    const { populateColumnWithFilters } = useGroupTableFilter();
    const { populateColumnWithSorters } = useGroupTableSorter();

    const fullFormValues = getValues();
    const formValues = _.get(getValues(), fieldName);

    const visibleItem = useMemo(() => item?.filter((i) => !i.hidden && i.type !== 'display'), [item]);

    const formItems: FormItems[] = useMemo(() => {
        return formValues?.items || [];
    }, [formValues?.items]);

    const fields = useMemo(() => _.map(visibleItem, (item) => item.linkId), [visibleItem]);

    const dataSource: GroupTableRow[] = useMemo(() => {
        return getDataSource(fields, formItems, questionItem);
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

    const dataColumns: ColumnsType<GroupTableRow> = useMemo(() => {
        const columns: ColumnsType<GroupTableRow> = _.map(visibleItem, (questionItem) => {
            const linkId = questionItem.linkId;
            const column: ColumnType<GroupTableRow> = {
                title: questionItem.text ? questionItem.text : linkId,
                dataIndex: linkId,
                key: linkId,
                render: (value: any) => (
                    <RenderFormItemReadOnly formItem={value.formItem} questionnaireItem={value.questionnaireItem} />
                ),
            };
            return column;
        });

        const columnsWithSorters = populateColumnWithSorters(columns, questionItem);
        return populateColumnWithFilters(columnsWithSorters, questionItem);
    }, [populateColumnWithFilters, populateColumnWithSorters, questionItem, visibleItem]);

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

    const handleRenderTypeToggle = useMemo(() => {
        if (!chartLinkIdX || !chartLinkIdY) {
            return undefined;
        }
        return (renderAsTable: boolean) => {
            setRenderAsTable(renderAsTable);
        };
    }, [chartLinkIdX, chartLinkIdY]);

    return {
        repeats,
        hidden,
        title,
        handleAdd,
        dataSource,
        columns,
        isModalVisible,
        editIndex,
        handleCancel,
        handleSave,
        snapshotDataSource,
        renderAsTable,
        handleRenderTypeToggle,
        chartLinkIdX,
        chartLinkIdY,
    };
}
