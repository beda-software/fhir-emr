import { useCallback, useMemo, useState } from 'react';

import { ColumnFilterValue, DateColumnFilterValue, SearchBarData, SearchBarProps } from './types';

export function useSearchBar(props: SearchBarProps): SearchBarData {
    const { columns } = props;

    const defaultFiltersValues = useMemo(() => {
        return columns.map((column) => ({ column }));
    }, [columns]);

    const [columnsFilterValues, setColumnsFilterValues] = useState<ColumnFilterValue[]>(defaultFiltersValues);

    const onChangeColumnFilter = useCallback(
        (value: DateColumnFilterValue | string, id: string) => {
            setColumnsFilterValues((prevFilterValue) => {
                const newFilterValue = [...prevFilterValue];

                const editedFilterValueIndex = newFilterValue.findIndex((v) => v.column.id === id);

                if (value === '') {
                    newFilterValue[editedFilterValueIndex]!.value = undefined;
                } else {
                    newFilterValue[editedFilterValueIndex]!.value = value;
                }

                return newFilterValue;
            });
        },
        [setColumnsFilterValues],
    );

    const onResetFilters = useCallback(() => {
        setColumnsFilterValues(defaultFiltersValues);
    }, [setColumnsFilterValues, defaultFiltersValues]);

    return { columnsFilterValues, onChangeColumnFilter, onResetFilters };
}
