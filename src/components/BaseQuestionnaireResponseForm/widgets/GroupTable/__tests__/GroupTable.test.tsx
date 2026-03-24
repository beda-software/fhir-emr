import { renderHook, waitFor } from '@testing-library/react';
import { FCEQuestionnaireItem, FormItems } from 'sdc-qrf';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { useGroupTable } from '../hooks';
import type { GroupTableProps } from '../types';
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
};

vi.mock('src/components/BaseQuestionnaireResponseForm/hooks', () => ({
    useFieldController: () => ({
        onChange: (next: { items: FormItems[] }) => {
            groupTableHookMocks.formValuesState = { group: next };
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
    useWatch: () => groupTableHookMocks.formValuesState,
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
