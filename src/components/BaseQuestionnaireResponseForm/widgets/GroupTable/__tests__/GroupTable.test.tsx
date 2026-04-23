import { act, renderHook, waitFor } from '@testing-library/react';
import { FCEQuestionnaireItem, FormItems } from 'sdc-qrf';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { useGroupTable, useRowExpandability } from '../hooks';
import type { GroupTableProps, GroupTableRow } from '../types';
import { getColumnWidth, getDataSource } from '../utils';

const fields = ['date', 'weight'];

const getFormItem = (date: string, weight: number): FormItems => {
    return {
        date: [
            {
                value: {
                    date,
                },
            },
        ],
        weight: [
            {
                value: {
                    Quantity: {
                        code: 'kg',
                        system: 'http://unitsofmeasure.org',
                        unit: 'kg',
                        value: weight,
                    },
                },
            },
        ],
    };
};

const getGroupQuestionnaireItem = (repeats: boolean): FCEQuestionnaireItem => {
    return {
        type: 'group',
        repeats,
        linkId: 'group',
        item: [
            {
                linkId: 'date',
                type: 'date',
            },
            {
                linkId: 'weight',
                type: 'quantity',
                unitOption: [
                    {
                        code: 'kg',
                        display: 'kg',
                        system: 'http://unitsofmeasure.org',
                    },
                ],
            },
        ],
    };
};

const getQuestionnaireItem = (
    props: { columnWidth?: { value?: number; unit?: string } } = {},
): FCEQuestionnaireItem => {
    return {
        type: 'string',
        linkId: 'string',
        text: 'string',
        columnWidth: props.columnWidth,
    };
};

const groupTableHookMocks = {
    mockOnChange: vi.fn(),
    mockReset: vi.fn(),
    formValuesState: { group: { items: [{} as FormItems] } } as { group: { items: FormItems[] } },
    watchedFormValuesState: { group: { items: [{} as FormItems] } } as { group: { items: FormItems[] } },
};

vi.mock('src/components/BaseQuestionnaireResponseForm/hooks', () => ({
    useFieldController: () => ({
        onChange: (next: { items: FormItems[] }) => {
            groupTableHookMocks.formValuesState = { group: next };
            groupTableHookMocks.watchedFormValuesState = { group: next };
            groupTableHookMocks.mockOnChange(next);
        },
    }),
}));

vi.mock('react-hook-form', () => ({
    useFormContext: () => ({
        control: {},
        getValues: () => groupTableHookMocks.formValuesState,
        reset: groupTableHookMocks.mockReset,
    }),
    useWatch: () => groupTableHookMocks.watchedFormValuesState,
}));

describe('GroupTable', () => {
    test('dataSource for repeatable group is extracted correctly', () => {
        const formItems = [getFormItem('2022-01-01', 70), getFormItem('2022-01-02', 75)];
        const questionnaireItem = getGroupQuestionnaireItem(true);
        const dataSource = getDataSource(fields, formItems, questionnaireItem);
        expect(dataSource.length).toBe(2);
        expect(dataSource[0]!.date?.linkId).toBe('date');
        expect(dataSource[0]!.date?.index).toBe(0);
        expect(dataSource[0]!.date!.formItem![0]!.value!.date!).toBe('2022-01-01');
        expect(dataSource[0]!.weight!.formItem![0]!.value!.Quantity!.value).toBe(70);
        expect(dataSource[1]!.date?.linkId).toBe('date');
        expect(dataSource[1]!.date?.index).toBe(1);
        expect(dataSource[1]!.date!.formItem![0]!.value!.date!).toBe('2022-01-02');
        expect(dataSource[1]!.weight!.formItem![0]!.value!.Quantity!.value).toBe(75);
    });

    test('dataSource for non-repeatable group is extracted correctly', () => {
        const formItems = [getFormItem('2022-01-01', 70)];
        const questionnaireItem = getGroupQuestionnaireItem(false);
        const dataSource = getDataSource(fields, formItems, questionnaireItem);
        expect(dataSource.length).toBe(1);
        expect(dataSource[0]!.date?.linkId).toBe('date');
        expect(dataSource[0]!.date?.index).toBe(0);
        expect(dataSource[0]!.date!.formItem![0]!.value!.date!).toBe('2022-01-01');
        expect(dataSource[0]!.weight!.formItem![0]!.value!.Quantity!.value).toBe(70);
    });

    test('dataSource is empty when a single row has no answers', () => {
        const formItems = [{} as FormItems];
        const questionnaireItem = getGroupQuestionnaireItem(true);
        const dataSource = getDataSource(fields, formItems, questionnaireItem);
        expect(dataSource.length).toBe(0);
    });
});

describe('useGroupTable', () => {
    beforeAll(() => {
        global.ResizeObserver = class {
            observe(): void {
                void 0;
            }
            unobserve(): void {
                void 0;
            }
            disconnect(): void {
                void 0;
            }
        };
    });

    beforeEach(() => {
        groupTableHookMocks.mockOnChange.mockClear();
        groupTableHookMocks.mockReset.mockClear();
        groupTableHookMocks.formValuesState = { group: { items: [{}] } };
        groupTableHookMocks.watchedFormValuesState = { group: { items: [{}] } };
    });

    test('removes a lone empty form row when dataSource is empty and modal is closed', async () => {
        const props: GroupTableProps = {
            parentPath: [],
            context: [],
            questionItem: getGroupQuestionnaireItem(true),
        };

        renderHook(() => useGroupTable(props));

        await waitFor(() => {
            expect(groupTableHookMocks.mockOnChange).toHaveBeenCalledWith({ items: [] });
        });
        expect(groupTableHookMocks.mockOnChange).toHaveBeenCalledTimes(1);
        expect(groupTableHookMocks.mockReset).toHaveBeenCalled();
    });

    test('deleting the middle row keeps data in other rows intact', async () => {
        const row1 = getFormItem('2022-01-01', 70);
        const row2 = getFormItem('2022-01-02', 75);
        const row3 = getFormItem('2022-01-03', 80);
        const rows = [row1, row2, row3];

        groupTableHookMocks.formValuesState = { group: { items: rows } };
        groupTableHookMocks.watchedFormValuesState = { group: { items: rows } };

        const props: GroupTableProps = {
            parentPath: [],
            context: [],
            questionItem: getGroupQuestionnaireItem(true),
        };

        const { result } = renderHook(() => useGroupTable(props));
        const actionColumn: any = result.current.columns[result.current.columns.length - 1];
        const actionCell: any = actionColumn.render(result.current.dataSource[1]!.date);
        const popconfirm: any = actionCell.props.children[1];

        await act(async () => {
            popconfirm.props.onConfirm();
        });

        await waitFor(() => {
            expect(groupTableHookMocks.mockOnChange).toHaveBeenLastCalledWith({ items: [row1, row3] });
        });
        expect(groupTableHookMocks.mockReset).toHaveBeenCalled();
    });

    test('delete uses latest getValues snapshot when watched values are stale', async () => {
        const latestRow1 = getFormItem('2022-01-01', 70);
        const latestRow2 = getFormItem('2022-01-02', 75);
        const latestRow3 = getFormItem('2022-01-03', 80);

        groupTableHookMocks.formValuesState = { group: { items: [latestRow1, latestRow2, latestRow3] } };
        groupTableHookMocks.watchedFormValuesState = { group: { items: [latestRow1, latestRow2] } };

        const props: GroupTableProps = {
            parentPath: [],
            context: [],
            questionItem: getGroupQuestionnaireItem(true),
        };

        const { result } = renderHook(() => useGroupTable(props));
        const actionColumn: any = result.current.columns[result.current.columns.length - 1];
        const actionCell: any = actionColumn.render(result.current.dataSource[0]!.date);
        const popconfirm: any = actionCell.props.children[1];

        await act(async () => {
            popconfirm.props.onConfirm();
        });

        await waitFor(() => {
            expect(groupTableHookMocks.mockOnChange).toHaveBeenLastCalledWith({ items: [latestRow2, latestRow3] });
        });
    });
});

describe('useRowExpandability', () => {
    beforeAll(() => {
        global.ResizeObserver = class {
            observe(): void {
                void 0;
            }
            unobserve(): void {
                void 0;
            }
            disconnect(): void {
                void 0;
            }
        };
    });

    test('keeps expanded keys reference stable when dataSource values are unchanged', async () => {
        const initialRows = [{ key: 'row-1' }] as GroupTableRow[];
        const { result, rerender } = renderHook(
            ({ dataSource }) =>
                useRowExpandability({
                    expandableMaxHeight: 100,
                    dataSource,
                }),
            { initialProps: { dataSource: initialRows } },
        );

        const initialExpandedKeys = result.current.isRowExpanded;

        rerender({ dataSource: [{ key: 'row-1' }] as GroupTableRow[] });

        await waitFor(() => {
            expect(result.current.isRowExpanded).toBe(initialExpandedKeys);
        });
    });

    test('repeated expand-all does not rewrite identical expanded state', () => {
        const dataSource = [{ key: 'row-1' }] as GroupTableRow[];
        const { result } = renderHook(() =>
            useRowExpandability({
                expandableMaxHeight: 100,
                dataSource,
            }),
        );

        const node = document.createElement('div');
        Object.defineProperty(node, 'clientHeight', { value: 250, configurable: true });

        act(() => {
            result.current.observeRow('row-1')(node);
            result.current.handleRowExpandAll();
        });

        const expandedRowKeysAfterFirstExpand = result.current.isRowExpanded;

        act(() => {
            result.current.handleRowExpandAll();
        });

        expect(result.current.isRowExpanded).toBe(expandedRowKeysAfterFirstExpand);
    });

    test('repeated collapse-all keeps empty expanded state reference stable', () => {
        const { result } = renderHook(() =>
            useRowExpandability({
                expandableMaxHeight: 100,
                dataSource: [] as GroupTableRow[],
            }),
        );

        const initialExpandedState = result.current.isRowExpanded;

        act(() => {
            result.current.handleRowCollapseAll();
        });

        expect(result.current.isRowExpanded).toBe(initialExpandedState);
    });
});

describe('getColumnWidth', () => {
    test('returns undefined if columnWidth is not set', () => {
        const questionItem = getQuestionnaireItem();
        const columnWidth = getColumnWidth(questionItem);
        expect(columnWidth).toBe(undefined);
    });

    test('returns the correct column width if columnWidth is set', () => {
        const questionItem = getQuestionnaireItem({ columnWidth: { value: 100, unit: 'px' } });
        const columnWidth = getColumnWidth(questionItem);
        expect(columnWidth).toBe('100px');
    });

    test('returns the correct column width if columnWidth is set with unit', () => {
        const questionItem = getQuestionnaireItem({ columnWidth: { value: 100, unit: '%' } });
        const columnWidth = getColumnWidth(questionItem);
        expect(columnWidth).toBe('100%');
    });

    test('returns the correct column width if columnWidth is set without unit', () => {
        const questionItem = getQuestionnaireItem({ columnWidth: { value: 100 } });
        const columnWidth = getColumnWidth(questionItem);
        expect(columnWidth).toBe('100px');
    });

    test('returns the correct column width if columnWidth is set without value', () => {
        const questionItem = getQuestionnaireItem({ columnWidth: { unit: '%' } });
        const columnWidth = getColumnWidth(questionItem);
        expect(columnWidth).toBe(undefined);
    });
});
