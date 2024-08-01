import { act, renderHook } from '@testing-library/react';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import {
    isReferenceColumnFilterValue,
    ReferenceTypeColumnFilterValue,
    SearchBarColumnType,
    SearchBarReferenceColumn,
} from 'src/components/SearchBar/types';

import { useReferenceColumn } from '../hooks';

const COLUMN_CASES: SearchBarReferenceColumn[] = [
    {
        id: 'patient',
        type: SearchBarColumnType.REFERENCE,
        placeholder: 'Search by patient',
        expression: 'Patient',
        path: "name.given.first() + ' ' + name.family",
    },
    {
        id: 'practitioner',
        type: SearchBarColumnType.REFERENCE,
        placeholder: 'Search by practitioner',
        expression: 'Practitioner',
        path: "name.given.first() + ' ' + name.family",
    },
];

describe('ReferenceColumn component testing', () => {
    test.each(COLUMN_CASES)('It loads options correctly', async (testColumnCase) => {
        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: [testColumnCase],
            });

            const { debouncedLoadOptions } = useReferenceColumn({
                columnFilterValue: columnsFilterValues[0] as ReferenceTypeColumnFilterValue,
                onChange: onChangeColumnFilter,
            });

            return {
                columnsFilterValues,
                debouncedLoadOptions,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        expect(result.current.columnsFilterValues.length).toEqual(1);
        expect(isReferenceColumnFilterValue(result.current.columnsFilterValues[0]!)).toBeTruthy();

        await act(async () => {
            result.current.debouncedLoadOptions('', (options) => {
                expect(options.length).toBeGreaterThan(0);

                for (const option of options) {
                    expect(option.value.Reference.resourceType).toBeIn(['Patient', 'Practitioner']);
                }
            });
        });
    });
});
