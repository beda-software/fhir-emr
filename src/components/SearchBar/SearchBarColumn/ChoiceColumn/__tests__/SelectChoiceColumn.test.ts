import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import {
    ChoiceTypeColumnFilterValue,
    isChoiceColumnFilterValue,
    SearchBarChoiceColumn,
    SearchBarColumnType,
} from 'src/components/SearchBar/types';
import { createValueSet, loginAdminUser } from 'src/setupTests';

import { valuesetEncounterStatusData } from './valuesetEncounterStatus';
import { useChoiceColumn } from '../hooks';

const OPTIONS_COLUMN_CASES: SearchBarChoiceColumn[] = [
    {
        id: 'status_options1',
        type: SearchBarColumnType.CHOICE,
        placeholder: 'Search by practitioner',
        options: [
            { value: { Coding: { code: 'finished', display: 'Finished' } } },
            { value: { Coding: { code: 'created', display: 'Created' } } },
        ],
    },
    {
        id: 'status_options2',
        type: SearchBarColumnType.CHOICE,
        placeholder: 'Search by practitioner',
        repeats: true,
        options: [
            { value: { Coding: { code: 'finished', display: 'Finished' } } },
            { value: { Coding: { code: 'created', display: 'Created' } } },
        ],
    },
];

describe('SelectChoiceColumn component testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
        await createValueSet(valuesetEncounterStatusData);
    });

    beforeEach(async () => {
        await loginAdminUser();
    });

    test.each(OPTIONS_COLUMN_CASES)(
        'It renders options correctly for options choice column: %s',
        async (columnCase) => {
            const { result } = renderHook(() => {
                const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                    columns: [columnCase],
                });

                const { onSelect, isOptionSelected, getOptionLabel, debouncedLoadOptions } = useChoiceColumn({
                    columnFilterValue: columnsFilterValues[0] as ChoiceTypeColumnFilterValue,
                    onChange: onChangeColumnFilter,
                });

                return {
                    onSelect,
                    isOptionSelected,
                    getOptionLabel,
                    onChangeColumnFilter,
                    onResetFilters,
                    columnsFilterValues,
                    debouncedLoadOptions,
                };
            });

            expect(result.current.columnsFilterValues).toHaveLength(1);
            expect(isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)).toBeTruthy();

            const mockCallback = vi.fn();

            await act(async () => {
                result.current.debouncedLoadOptions('', mockCallback);
            });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)).toBeTruthy();
                if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                    expect(result.current.columnsFilterValues[0].column.options!.length).toEqual(
                        columnCase.options!.length,
                    );
                }
            });

            await waitFor(() => {
                if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                    result.current.columnsFilterValues[0].column.options!.forEach((option, index) => {
                        expect(columnCase.options![index]!.value).toEqual(option.value);
                    });
                }
            });

            if (columnCase.repeats) {
                act(() => {
                    if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                        result.current.onSelect([
                            result.current.columnsFilterValues[0].column.options![0],
                            result.current.columnsFilterValues[0].column.options![1],
                        ]);
                    }
                });
                await waitFor(() => {
                    if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                        expect(result.current.columnsFilterValues[0].value).toEqual([
                            result.current.columnsFilterValues[0].column.options![0],
                            result.current.columnsFilterValues[0].column.options![1],
                        ]);
                    }
                });

                if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                    expect(
                        result.current.isOptionSelected(result.current.columnsFilterValues[0].column.options![0]),
                    ).toBeTruthy();
                    expect(
                        result.current.isOptionSelected(result.current.columnsFilterValues[0].column.options![1]),
                    ).toBeTruthy();
                    expect(
                        result.current.getOptionLabel(result.current.columnsFilterValues[0].column.options![0]!),
                    ).toEqual(columnCase.options![0]!.value.Coding.display);
                    expect(
                        result.current.getOptionLabel(result.current.columnsFilterValues[0].column.options![1]!),
                    ).toEqual(columnCase.options![1]!.value.Coding.display);
                }

                act(() => {
                    result.current.onResetFilters();
                });
                await waitFor(() => {
                    expect(result.current.columnsFilterValues[0]?.value).toBeNull();
                });
            } else {
                act(() => {
                    if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                        result.current.onSelect(result.current.columnsFilterValues[0]?.column.options![0]);
                    }
                });
                await waitFor(() => {
                    if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                        expect(result.current.columnsFilterValues[0]!.value).toEqual([
                            result.current.columnsFilterValues[0].column.options![0],
                        ]);
                    }
                });

                if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                    expect(
                        result.current.isOptionSelected(result.current.columnsFilterValues[0].column.options![0]),
                    ).toBeTruthy();
                    expect(
                        result.current.getOptionLabel(result.current.columnsFilterValues[0].column.options![0]!),
                    ).toEqual(columnCase.options![0]!.value.Coding.display);
                }

                act(() => {
                    result.current.onResetFilters();
                });
                await waitFor(() => {
                    expect(result.current.columnsFilterValues[0]?.value).toBeNull();
                });
            }
        },
    );
});
