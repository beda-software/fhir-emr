import { useCallback, useMemo, useState } from 'react';

import {
    ColumnFilterValue,
    isDateColumn,
    isReferenceColumn,
    isStringColumn,
    isStringColumnFilterValue,
    isDateColumnFilterValue,
    isReferenceColumnFilterValue,
    SearchBarData,
    SearchBarProps,
    isChoiceColumn,
    isChoiceColumnFilterValue,
    isSolidChoiceColumn,
    isSolidChoiceColumnFilterValue,
    isSingleDateColumn,
    isSingleDateColumnFilterValue,
} from './types';
import {
    validateStringColumnFilterValue,
    validateDateColumnFilterValue,
    validateReferenceColumnFilterValue,
    validateChoiceColumnFilterValue,
    validateSolidChoiceColumnFilterValue,
    validateSingleDateColumnFilterValue,
} from './validate';

export function useSearchBar(props: SearchBarProps): SearchBarData {
    const { columns } = props;

    const defaultFiltersValues = useMemo<ColumnFilterValue[]>(() => {
        return columns.map((column) => {
            if (isStringColumn(column)) {
                return { column, value: undefined };
            }

            if (isDateColumn(column)) {
                return { column, value: undefined };
            }

            if (isSingleDateColumn(column)) {
                return { column, value: column.defaultValue ?? undefined };
            }

            if (isReferenceColumn(column)) {
                return {
                    column,
                    value: column.defaultValue
                        ? {
                              value: {
                                  Reference: column.defaultValue,
                              },
                          }
                        : null,
                };
            }

            if (isChoiceColumn(column)) {
                return { column, value: column.defaultValue ? [column.defaultValue] : null };
            }

            if (isSolidChoiceColumn(column)) {
                return { column, value: column.defaultValue ? [column.defaultValue] : null };
            }

            throw new Error('Unsupported column type');
        });
    }, [columns]);

    const [columnsFilterValues, setColumnsFilterValues] = useState<ColumnFilterValue[]>(defaultFiltersValues);

    const onChangeColumnFilter = useCallback(
        (value: ColumnFilterValue['value'], id: string) => {
            setColumnsFilterValues((prevFilterValues) => {
                return prevFilterValues.map((filterValue) => {
                    if (filterValue.column.id !== id) {
                        return filterValue;
                    }

                    const newFilterValue = { ...filterValue };

                    if (isStringColumnFilterValue(newFilterValue)) {
                        if (validateStringColumnFilterValue(value)) {
                            newFilterValue.value = value;
                            return newFilterValue;
                        }
                    }

                    if (isDateColumnFilterValue(newFilterValue)) {
                        if (validateDateColumnFilterValue(value)) {
                            newFilterValue.value = value;
                            return newFilterValue;
                        }
                    }

                    if (isSingleDateColumnFilterValue(newFilterValue)) {
                        if (validateSingleDateColumnFilterValue(value)) {
                            newFilterValue.value = value;
                            return newFilterValue;
                        }
                    }

                    if (isReferenceColumnFilterValue(newFilterValue)) {
                        if (validateReferenceColumnFilterValue(value)) {
                            newFilterValue.value = value;
                            return newFilterValue;
                        }
                    }

                    if (isChoiceColumnFilterValue(newFilterValue)) {
                        if (validateChoiceColumnFilterValue(value)) {
                            newFilterValue.value = value;
                            return newFilterValue;
                        }
                    }

                    if (isSolidChoiceColumnFilterValue(newFilterValue)) {
                        if (validateSolidChoiceColumnFilterValue(value)) {
                            newFilterValue.value = value;
                            return newFilterValue;
                        }
                    }

                    throw new Error('Unsupported column type');
                });
            });
        },
        [setColumnsFilterValues],
    );

    const onResetFilters = useCallback(() => {
        setColumnsFilterValues(defaultFiltersValues);
    }, [setColumnsFilterValues, defaultFiltersValues]);

    return { columnsFilterValues, onChangeColumnFilter, onResetFilters };
}
