import { parseFHIRDateTime } from 'aidbox-react/lib/utils/date';
import { useCallback, useMemo, useState } from 'react';

import {
    ColumnFilterValue,
    DateColumnFilterValue,
    PopulatedSearchData,
    PopulateSearchProp,
    SearchBarData,
    SearchBarItem,
    SearchBarProps,
} from './types';

export function useSearchBar<T extends SearchBarItem>(props: SearchBarProps<T>): SearchBarData<T> {
    const { columns, data } = props;

    const defaultFiltersValues = useMemo(() => {
        return columns.map((column) => ({ column }));
    }, [columns]);

    const [columnsFilterValues, setColumnsFilterValues] =
        useState<ColumnFilterValue<T>[]>(defaultFiltersValues);

    const onChangeColumnFilter = useCallback(
        (value: DateColumnFilterValue | string, id: string) => {
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
                const stringFilterValue = filterValue.value ? (filterValue.value as string) : '';

                if (stringFilterValue) {
                    if (populatedResultData) {
                        resultData = populatedResultData.reduce((result: T[], itemData) => {
                            if (
                                itemData.searchProp
                                    .toLowerCase()
                                    .includes(stringFilterValue.toLowerCase())
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
                                      .includes(stringFilterValue.toLowerCase())
                                : false;
                        });
                    }
                }
            }

            if (filterValue.column.type === 'date') {
                const dateFilterValue = filterValue.value
                    ? (filterValue.value as DateColumnFilterValue)
                    : [];

                if (dateFilterValue.length === 2) {
                    const searchPropKey = filterValue.column.key as string;

                    resultData = resultData.filter((item) => {
                        const itemSearchProp =
                            typeof item[searchPropKey] === 'string'
                                ? parseFHIRDateTime(item[searchPropKey])
                                : (item[searchPropKey] as moment.Moment);

                        return itemSearchProp.isBetween(dateFilterValue[0], dateFilterValue[1]);
                    });
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
