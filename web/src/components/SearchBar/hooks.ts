import { useCallback, useMemo, useState } from 'react';

import {
    ColumnFilterValue,
    PopulatedSearchData,
    PopulateSearchProp,
    SearchBarData,
    SearchBarItem,
    SearchBarProps,
} from './types';

export function useSearchBar<T extends SearchBarItem>(props: SearchBarProps<T>): SearchBarData<T> {
    const { columns, data } = props;

    const defaultFiltersValues = useMemo(() => {
        return columns.map((column) => ({ value: '', column }));
    }, [columns]);

    const [columnsFilterValues, setColumnsFilterValues] =
        useState<ColumnFilterValue<T>[]>(defaultFiltersValues);

    const onChangeColumnFilter = useCallback(
        (value: string, id: string) => {
            setColumnsFilterValues((prevFilterValue) => {
                const newFilterValue = [...prevFilterValue];

                const editedFilterValueIndex = newFilterValue.findIndex((v) => v.column.id === id);

                if (editedFilterValueIndex >= 0) {
                    newFilterValue[editedFilterValueIndex]!.value = value;
                }

                return newFilterValue;
            });
        },
        [setColumnsFilterValues],
    );

    const filteredData = useMemo(() => {
        let resultData = [...data];

        for (const filterValue of columnsFilterValues) {
            const populateSearchProp =
                typeof filterValue.column.key === 'function'
                    ? (filterValue.column.key as PopulateSearchProp<T>)
                    : undefined;

            const populatedResultData: PopulatedSearchData<T>[] | undefined = populateSearchProp
                ? resultData.map((item) => ({
                      searchProp: populateSearchProp(item),
                      item,
                  }))
                : undefined;

            if (filterValue.column.type === 'string') {
                if (filterValue.value) {
                    if (populatedResultData) {
                        resultData = populatedResultData.reduce((result: T[], itemData) => {
                            if (
                                itemData.searchProp
                                    .toLowerCase()
                                    .includes(filterValue.value.toLowerCase())
                            ) {
                                return [...result, itemData.item];
                            }

                            return [...result];
                        }, []);
                    } else {
                        const searchPropKey = filterValue.column.key as string;

                        resultData = resultData.filter((item) => {
                            const itemSearchProp = item[searchPropKey] as string | undefined;

                            return itemSearchProp
                                ? itemSearchProp
                                      .toLowerCase()
                                      .includes(filterValue.value.toLowerCase())
                                : false;
                        });
                    }
                }
            }
        }

        return resultData;
    }, [data, columnsFilterValues]);

    const onResetFilters = useCallback(() => {
        setColumnsFilterValues(defaultFiltersValues);
    }, [setColumnsFilterValues, defaultFiltersValues]);

    return { columnsFilterValues, filteredData, onChangeColumnFilter, onResetFilters };
}
