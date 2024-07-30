import { useCallback, useMemo, useState } from 'react';

import {
    ColumnFilterValue,
    DateTypeColumnFilterValue,
    isDateColumn,
    isReferenceColumn,
    isStringColumn,
    isStringColumnFilterValue,
    isDateColumnFilterValue,
    isReferenceColumnFilterValue,
    ReferenceTypeColumnFilterValue,
    SearchBarData,
    SearchBarProps,
    StringTypeColumnFilterValue,
} from './types';

export function useSearchBar(props: SearchBarProps): SearchBarData {
    const { columns } = props;

    const defaultFiltersValues = useMemo(() => {
        return columns.map((column) => {
            if (isStringColumn(column)) {
                return { column } as StringTypeColumnFilterValue;
            } else if (isDateColumn(column)) {
                return { column } as DateTypeColumnFilterValue;
            } else if (isReferenceColumn(column)) {
                return { column, value: null } as ReferenceTypeColumnFilterValue;
            }

            throw new Error('Unsupported column type');
        });
    }, [columns]);
    const [columnsFilterValues, setColumnsFilterValues] = useState<ColumnFilterValue[]>(defaultFiltersValues);

    const onChangeColumnFilter = useCallback(
        (value: ColumnFilterValue['value'], id: string) => {
            setColumnsFilterValues((prevFilterValues) => {
                const newFilterValues = [...prevFilterValues];
                const newFilterValueIndex = newFilterValues.findIndex((v) => v.column.id === id);

                if (newFilterValueIndex === -1) {
                    throw new Error('Filter value not found');
                }

                const newFilterValue = newFilterValues[newFilterValueIndex]!;

                if (isStringColumnFilterValue(newFilterValue)) {
                    newFilterValues[newFilterValueIndex]!.value = value === '' ? undefined : value;
                }

                if (isDateColumnFilterValue(newFilterValue)) {
                    newFilterValues[newFilterValueIndex]!.value = value;
                }

                if (isReferenceColumnFilterValue(newFilterValue)) {
                    newFilterValues[newFilterValueIndex]!.value = value;
                }

                return newFilterValues;
            });
        },
        [setColumnsFilterValues],
    );

    const onResetFilters = useCallback(() => {
        setColumnsFilterValues(defaultFiltersValues);
    }, [setColumnsFilterValues, defaultFiltersValues]);

    return { columnsFilterValues, onChangeColumnFilter, onResetFilters };
}
