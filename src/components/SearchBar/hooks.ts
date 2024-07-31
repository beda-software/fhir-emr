import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';

import { Resource } from '@beda.software/aidbox-types';

import { LoadResourceOption } from 'src/services/questionnaire';

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

                if (isStringColumnFilterValue(newFilterValues[newFilterValueIndex]!)) {
                    newFilterValues[newFilterValueIndex]!.value =
                        !_.isString(value) || value === '' ? undefined : value;
                }

                if (isDateColumnFilterValue(newFilterValues[newFilterValueIndex]!)) {
                    newFilterValues[newFilterValueIndex]!.value = _.isArray(value) ? value : undefined;
                }

                if (isReferenceColumnFilterValue(newFilterValues[newFilterValueIndex]!)) {
                    newFilterValues[newFilterValueIndex]!.value = _.isObject(value)
                        ? (value as LoadResourceOption<Resource>)
                        : null;
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
