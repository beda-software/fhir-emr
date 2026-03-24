import type { FilterDropdownProps, SorterResult, ColumnsType } from 'antd/es/table/interface';
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
    const updateColumn = (column: ColumnsType<RecordType<R>>[number]): ColumnsType<RecordType<R>>[number] => {
        const filter = filters.find((f) => f.column.id === column.key);

        const updatedColumn = {
            ...column,
            filtered: !_.isUndefined(filter?.value) && !_.isNull(filter?.value) && filter?.value !== '',
            filterDropdown: filter
                ? (props: FilterDropdownProps) => <TableFilter {...props} filter={filter} onChange={onChange} />
                : undefined,
            sorter: !!sorters.find((sorter) => sorter.id === column.key),
            sortOrder: currentSorter.columnKey === column.key ? currentSorter.order : undefined,
        };

        if ('children' in column && column.children) {
            return {
                ...updatedColumn,
                children: column.children.map(updateColumn),
            };
        }

        return updatedColumn;
    };

    const result = tableColumns.map(updateColumn);

    return result;
}
