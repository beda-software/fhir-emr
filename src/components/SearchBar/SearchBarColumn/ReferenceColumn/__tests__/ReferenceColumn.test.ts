import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import {
    isReferenceColumnFilterValue,
    ReferenceTypeColumnFilterValue,
    SearchBarColumnType,
    SearchBarReferenceColumn,
} from 'src/components/SearchBar/types';
import { loginAdminUser } from 'src/setupTests';

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
    beforeEach(async () => {
        await loginAdminUser();
    });

    test.each(COLUMN_CASES)('It loads options correctly for column %s', async (testColumnCase) => {
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

        expect(result.current.columnsFilterValues).toHaveLength(1);
        expect(isReferenceColumnFilterValue(result.current.columnsFilterValues[0]!)).toBeTruthy();

        const mockCallback = vi.fn();

        await act(async () => {
            result.current.debouncedLoadOptions('', mockCallback);
        });

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalled();
        });

        const options = mockCallback.mock.calls[0][0];
        await waitFor(() => {
            expect(options.length).toBeGreaterThan(0);
        });
        await waitFor(() => {
            options.forEach((option: any) => {
                expect(['Patient', 'Practitioner']).to.include(option.value.Reference.resourceType);
            });
        });
    });
});
