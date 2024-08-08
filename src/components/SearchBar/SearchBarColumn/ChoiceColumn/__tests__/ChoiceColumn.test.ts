import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';

import { ValueSetOption } from 'src/components/BaseQuestionnaireResponseForm/widgets/choice/service';
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

const VALUE_SET_COLUMN_CASE: SearchBarChoiceColumn = {
    id: 'status_valueset',
    type: SearchBarColumnType.CHOICE,
    placeholder: 'Search by vastatus',
    valueSet: 'encounter-status',
};

const OPTIONS_COLUMN_CASE: SearchBarChoiceColumn = {
    id: 'status_options',
    type: SearchBarColumnType.CHOICE,
    placeholder: 'Search by practitioner',
    options: [
        { value: { Coding: { code: 'finished', display: 'Finished' } } },
        { value: { Coding: { code: 'created', display: 'Created' } } },
    ],
};

describe('ChoiceColumn component testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
        await createValueSet(valuesetEncounterStatusData);
    });

    beforeEach(async () => {
        await loginAdminUser();
    });

    test('It loads options correctly for valueset choice column column', async () => {
        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: [VALUE_SET_COLUMN_CASE],
            });

            const { onSelect, isOptionSelected, getOptionLabel, debouncedLoadOptions } = useChoiceColumn({
                columnFilterValue: columnsFilterValues[0] as ChoiceTypeColumnFilterValue,
                onChange: onChangeColumnFilter,
            });

            return {
                onSelect,
                isOptionSelected,
                getOptionLabel,
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

        const options = mockCallback.mock.calls[0][0];

        const valuesetEncounterStatusCodes = valuesetEncounterStatusData.compose!.include[0]!.concept!.map(
            (concept) => concept.code,
        );

        await waitFor(() => {
            expect(options.length).toEqual(valuesetEncounterStatusCodes.length);
        });
        await waitFor(() => {
            options.forEach((option: ValueSetOption) => {
                expect(valuesetEncounterStatusCodes).to.include(option.value.Coding.code);
            });
        });

        act(() => {
            result.current.onSelect(options[0]);
        });
        await waitFor(() => {
            expect(result.current.columnsFilterValues[0]!.value).toEqual([options[0]]);
        });
        expect(result.current.isOptionSelected(options[0])).toBeTruthy();
        expect(result.current.getOptionLabel(options[0])).toEqual(options[0].value.Coding.display);

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(result.current.columnsFilterValues[0]?.value).toBeNull();
        });
    });

    test('It renders options correctly for options choice column', async () => {
        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: [OPTIONS_COLUMN_CASE],
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
            expect(mockCallback).not.toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)).toBeTruthy();
            if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                expect(result.current.columnsFilterValues[0].column.options!.length).toEqual(
                    OPTIONS_COLUMN_CASE.options!.length,
                );
            }
        });
        await waitFor(() => {
            if (isChoiceColumnFilterValue(result.current.columnsFilterValues[0]!)) {
                result.current.columnsFilterValues[0].column.options!.forEach((option: any) => {
                    expect(OPTIONS_COLUMN_CASE.options!.map((o) => o.value)).to.include(option.value);
                });
            }
        });

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
            expect(result.current.getOptionLabel(result.current.columnsFilterValues[0].column.options![0]!)).toEqual(
                OPTIONS_COLUMN_CASE.options![0]!.value.Coding.display,
            );
        }

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(result.current.columnsFilterValues[0]?.value).toBeNull();
        });
    });
});
