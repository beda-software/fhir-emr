import type { FilterDropdownProps, SorterResult, ColumnsType, ColumnType } from 'antd/es/table/interface';
import { Bundle, Resource } from 'fhir/r4b';
import _ from 'lodash';

import { ColumnFilterValue, SorterColumn } from 'src/components/SearchBar/types';

import { TableFilter } from './TableFilter';

export type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

interface Props<R extends Resource> {
    tableColumns: ColumnsType<RecordType<R>>;
    filters: ColumnFilterValue[];
    sorters: SorterColumn[];
    currentSorter: SorterResult;
    onChange: (value: ColumnFilterValue['value'], key: string) => void;
}

export function populateTableColumnsWithFiltersAndSorts<R extends Resource>(
    props: Props<R>,
): ColumnsType<RecordType<R>> {
    const { tableColumns, filters, sorters, currentSorter, onChange } = props;
    const result = tableColumns.map((column) => {
        const filter = filters.find((f) => f.column.id === column.key);

        const updatedColumn: ColumnType<RecordType<R>> = {
            ...column,
            filtered: !_.isUndefined(filter?.value) && !_.isNull(filter?.value) && filter?.value !== '',
            filterDropdown: filter
                ? (props: FilterDropdownProps) => <TableFilter {...props} filter={filter} onChange={onChange} />
                : undefined,
            sorter: !!sorters.find((sorter) => sorter.id === column.key),
            sortOrder: currentSorter.columnKey === column.key ? currentSorter.order : undefined,
        };

        return updatedColumn;
    });

    return result;
}
