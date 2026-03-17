import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Popconfirm } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { ExpandableConfig, FilterDropdownProps } from 'antd/es/table/interface';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FCEQuestionnaireItem, FormItems, RepeatableFormGroupItems, populateItemKey } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { RenderFormItemReadOnly } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/RenderFormItemReadOnly';
import { ColumnFilterValue, SearchBarColumn } from 'src/components/SearchBar/types';
import { TableFilter } from 'src/components/Table/TableFilter';

import { S } from './styles';
import { GroupTableItem, GroupTableProps, GroupTableRow } from './types';
import {
    createColumnFilterValue,
    getDataSource,
    getSearchBarColumnType,
    getGroupSorter,
    isColumnTypeArray,
    isTableItemMatchesFilter,
    getChartYRange,
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

export interface UseRowExpandabilityProps {
    expandableMaxHeight: number;
    dataSource: GroupTableRow[];
}

export function useRowExpandability(props: UseRowExpandabilityProps) {
    const { expandableMaxHeight, dataSource } = props;

    const rowRefs = useRef<Record<string, HTMLDivElement>>({});
    const rowObserverRef = useRef<ResizeObserver | null>(null);
    const rowNodeKeyRef = useRef<WeakMap<Element, string>>(new WeakMap());
    const expandableMaxHeightRef = useRef<number>(expandableMaxHeight);
    const [rowExpandableMap, setRowExpandableMap] = useState<Record<string, boolean>>({});
    const [isRowExpanded, setIsRowExpanded] = useState<readonly React.Key[]>([]);

    useEffect(() => {
        expandableMaxHeightRef.current = expandableMaxHeight;
    }, [expandableMaxHeight]);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const rowKey = rowNodeKeyRef.current.get(entry.target);
                if (!rowKey) {
                    return;
                }
                const nextHeight = entry.contentRect.height;
                if (nextHeight <= expandableMaxHeightRef.current + 32) {
                    return;
                }
                setRowExpandableMap((prev) => {
                    if (prev[rowKey] === true) {
                        return prev;
                    }
                    return {
                        ...prev,
                        [rowKey]: true,
                    };
                });
            });
        });
        rowObserverRef.current = observer;
        _.forEach(rowRefs.current, (node) => observer.observe(node));
        return () => {
            observer.disconnect();
            rowObserverRef.current = null;
        };
    }, []);

    const observeRow = useCallback(
        (rowKey: string) => (node: HTMLDivElement | null) => {
            const observer = rowObserverRef.current;
            const prevNode = rowRefs.current[rowKey];
            if (prevNode && prevNode !== node && observer) {
                observer.unobserve(prevNode);
                rowNodeKeyRef.current.delete(prevNode);
            }
            if (node) {
                rowRefs.current[rowKey] = node;
                rowNodeKeyRef.current.set(node, rowKey);
                observer?.observe(node);
            } else {
                if (prevNode) {
                    rowNodeKeyRef.current.delete(prevNode);
                }
                delete rowRefs.current[rowKey];
            }
        },
        [],
    );

    useEffect(() => {
        const keys = new Set(dataSource.map((row) => row.key));
        setRowExpandableMap((prev) => {
            let changed = false;
            const next: Record<string, boolean> = {};
            Object.keys(prev).forEach((key) => {
                const value = prev[key];
                if (keys.has(key) && value !== undefined) {
                    next[key] = value;
                } else {
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [dataSource]);

    const recomputeRowExpandability = useCallback(() => {
        const maxHeight = expandableMaxHeightRef.current + 32;
        const next: Record<string, boolean> = {};
        Object.entries(rowRefs.current).forEach(([rowKey, node]) => {
            if (node) {
                next[rowKey] = node.clientHeight > maxHeight;
            }
        });
        setRowExpandableMap((prev) => {
            const prevKeys = Object.keys(prev);
            const nextKeys = Object.keys(next);
            if (prevKeys.length !== nextKeys.length) {
                return next;
            }
            const unchanged = prevKeys.every((key) => prev[key] === next[key]);
            return unchanged ? prev : next;
        });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            recomputeRowExpandability();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [recomputeRowExpandability]);

    const rowHeightExceedsMaxHeight = useCallback(
        (rowKey: string) => {
            const cachedExpandable = rowExpandableMap[rowKey];
            if (cachedExpandable !== undefined) {
                return cachedExpandable;
            }
            const rowHeight = rowRefs.current[rowKey]?.clientHeight ?? 0;
            return rowHeight > expandableMaxHeight;
        },
        [expandableMaxHeight, rowExpandableMap],
    );

    const handleRowHeightRecompute = useCallback(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(recomputeRowExpandability);
        });
    }, [recomputeRowExpandability]);

    const handleRowExpand = useCallback(
        (expanded: boolean, record: GroupTableRow) => {
            setIsRowExpanded(expanded ? [...isRowExpanded, record.key] : isRowExpanded.filter((k) => k !== record.key));
        },
        [isRowExpanded],
    );

    return {
        observeRow,
        rowHeightExceedsMaxHeight,
        handleRowHeightRecompute,
        handleRowExpand,
        isRowExpanded,
    };
}

export function useGroupTable(props: GroupTableProps) {
    const { parentPath, questionItem, expandableMaxHeight = 100, columnAlignment } = props;
    const { linkId, repeats, text, hidden, item } = questionItem;

    const title = text ? text : linkId;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    const chartLinkIdX = questionItem.enableChart?.linkIdX;
    const chartLinkIdY = questionItem.enableChart?.linkIdY;

    const chartYRange = getChartYRange(questionItem);
    const chartHighlightAreas = questionItem.chartHighlight;

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

    const { observeRow, rowHeightExceedsMaxHeight, handleRowHeightRecompute, handleRowExpand, isRowExpanded } =
        useRowExpandability({
            expandableMaxHeight,
            dataSource,
        });

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
        handleRowHeightRecompute();
    }, [fullFormValues, handleRowHeightRecompute, reset]);

    const populateValue = (existingItems: Array<any>) => [...existingItems, {}].map(populateItemKey);

    const handleAdd = useCallback(() => {
        if (dataSource.length === 0 && formItems.length !== 0) {
            // This one case happens when the user deletes all items
            handleOpen(0);
        } else {
            const updatedItems = populateValue(formItems);
            const updatedInput = { ...formValues, items: updatedItems };
            const currentFullFormValues = _.cloneDeep(getValues());
            _.set(currentFullFormValues, fieldName, _.cloneDeep(updatedItems));
            onChange(updatedInput);
            handleOpen(formItems.length);
        }
    }, [dataSource, formItems, handleOpen, formValues, getValues, fieldName, onChange]);

    const handleDelete = useCallback(
        (index: number) => {
            const filteredArray = _.filter(formItems, (_val, valIndex: number) => valIndex !== index);
            const updatedGroupValue = { items: [...filteredArray] };
            const currentFullFormValues = _.cloneDeep(getValues());
            _.set(currentFullFormValues, fieldName, _.cloneDeep(updatedGroupValue));
            reset(currentFullFormValues, { keepDirty: true });
            onChange(updatedGroupValue);
        },
        [fieldName, formItems, getValues, onChange, reset],
    );

    const getColumnAlignment = (questionItem: FCEQuestionnaireItem) => {
        const type = questionItem.type;

        switch (type) {
            case 'integer':
            case 'decimal':
            case 'quantity':
                return 'right';
            default:
                return 'left';
        }
    };

    const dataColumns: ColumnsType<GroupTableRow> = useMemo(() => {
        const columns: ColumnsType<GroupTableRow> = _.map(visibleItem, (questionItem) => {
            const linkId = questionItem.linkId;
            const isExpandable = questionItem.type === 'text';
            const column: ColumnType<GroupTableRow> = {
                title: questionItem.text ? questionItem.text : linkId,
                dataIndex: linkId,
                key: linkId,
                align: columnAlignment
                    ? typeof columnAlignment === 'function'
                        ? columnAlignment(questionItem)
                        : columnAlignment
                    : getColumnAlignment(questionItem),

                render: (value: GroupTableItem, record) => {
                    const rowKey = record.key;
                    const notFitsMaxHeight = rowHeightExceedsMaxHeight(rowKey);
                    const isExpanded = isRowExpanded.includes(rowKey);
                    return (
                        <>
                            <S.ReadonlyItemWrapper
                                $maxHeight={isExpandable ? expandableMaxHeight : undefined}
                                $notFitsMaxHeight={notFitsMaxHeight}
                            >
                                <div ref={isExpandable ? observeRow(rowKey) : undefined}>
                                    <RenderFormItemReadOnly
                                        formItem={value.formItem}
                                        questionnaireItem={value.questionnaireItem}
                                    />
                                </div>
                            </S.ReadonlyItemWrapper>
                            <S.ExpandButton $isExpanded={isExpanded}>
                                {isExpandable && notFitsMaxHeight && (
                                    <Button icon={isExpanded ? <MinusOutlined /> : <PlusOutlined />} />
                                )}
                            </S.ExpandButton>
                        </>
                    );
                },
            };
            return column;
        });

        const columnsWithSorters = populateColumnWithSorters(columns, questionItem);
        return populateColumnWithFilters(columnsWithSorters, questionItem);
    }, [
        columnAlignment,
        expandableMaxHeight,
        isRowExpanded,
        observeRow,
        populateColumnWithFilters,
        populateColumnWithSorters,
        questionItem,
        rowHeightExceedsMaxHeight,
        visibleItem,
    ]);

    const expandable: ExpandableConfig<GroupTableRow> | undefined = useMemo(() => {
        const expandableItem = visibleItem?.find((item) => item.type === 'text');
        const expandableColumnKey = expandableItem?.linkId;

        if (!expandableColumnKey) {
            return undefined;
        }

        return {
            rowExpandable: (record) => rowHeightExceedsMaxHeight(record.key),
            expandedRowRender: (record) => (
                <RenderFormItemReadOnly
                    formItem={record[expandableColumnKey]?.formItem}
                    questionnaireItem={record[expandableColumnKey]?.questionnaireItem}
                />
            ),
            onExpand: (expanded: boolean, record: GroupTableRow) => handleRowExpand(expanded, record),
            showExpandColumn: false,
            expandRowByClick: true,
        };
    }, [handleRowExpand, rowHeightExceedsMaxHeight, visibleItem]);

    const actionColumn = useMemo(() => {
        return {
            title: 'Actions',
            dataIndex: fields[0] ?? 'id',
            key: 'action',
            width: 180,
            render: (value: GroupTableItem) => {
                if (value?.index === undefined) {
                    return null;
                }
                return (
                    <S.ActionButtons>
                        <Button
                            type="link"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleOpen(value?.index);
                            }}
                        >{t`Edit`}</Button>
                        <Popconfirm
                            title={t`Are you sure you want to delete this item?`}
                            onConfirm={() => handleDelete(value.index)}
                        >
                            <Button type="link" danger onClick={(event) => event.stopPropagation()}>{t`Delete`}</Button>
                        </Popconfirm>
                    </S.ActionButtons>
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
        expandable,
        isModalVisible,
        editIndex,
        handleCancel,
        handleSave,
        snapshotDataSource,
        renderAsTable,
        handleRenderTypeToggle,
        chartLinkIdX,
        chartLinkIdY,
        chartYRange,
        chartHighlightAreas,
    };
}
