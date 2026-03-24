import type { ColumnsType, FilterDropdownProps, SorterResult } from 'antd/es/table/interface';
import type { Resource } from 'fhir/r4b';
import type { ReactNode } from 'react';

import { SearchBarColumnType, type ColumnFilterValue, type SorterColumn } from 'src/components/SearchBar/types';

import { populateTableColumnsWithFiltersAndSorts, type RecordType } from '../utils';

describe('populateTableColumnsWithFiltersAndSorts', () => {
    const onChange = vi.fn();

    const baseColumns: ColumnsType<RecordType<Resource>> = [
        { key: 'name', dataIndex: 'name', title: 'Name' },
        { key: 'status', dataIndex: 'status', title: 'Status' },
    ];

    const filters: ColumnFilterValue[] = [
        {
            column: { id: 'name', type: SearchBarColumnType.STRING, placeholder: 'Name' },
            value: 'John',
        },
        {
            column: { id: 'status', type: SearchBarColumnType.STRING, placeholder: 'Status' },
            value: '',
        },
    ];

    const sorters: SorterColumn[] = [{ id: 'name', label: 'Name', searchParam: '_sort' }];

    it('applies filtered state, sorter and current sort order', () => {
        const currentSorter = { columnKey: 'name', order: 'ascend' } as SorterResult;

        const result = populateTableColumnsWithFiltersAndSorts<Resource>({
            tableColumns: baseColumns,
            filters,
            sorters,
            currentSorter,
            onChange,
        });

        expect(result).toHaveLength(2);
        expect(result[0]?.filtered).toBe(true);
        expect(result[0]?.sorter).toBe(true);
        expect(result[0]?.sortOrder).toBe('ascend');

        expect(result[1]?.filtered).toBe(false);
        expect(result[1]?.sorter).toBe(false);
        expect(result[1]?.sortOrder).toBeUndefined();
    });

    it('creates filterDropdown only for columns with matching filter', () => {
        const currentSorter = { columnKey: 'status', order: 'descend' } as SorterResult;

        const result = populateTableColumnsWithFiltersAndSorts<Resource>({
            tableColumns: baseColumns,
            filters: [filters[0]!],
            sorters: [],
            currentSorter,
            onChange,
        });

        expect(result[0]?.filterDropdown).toBeDefined();
        expect(result[1]?.filterDropdown).toBeUndefined();

        const filterDropdown = result[0]?.filterDropdown as ((props: FilterDropdownProps) => ReactNode) | undefined;
        const dropdown = filterDropdown?.({} as FilterDropdownProps);
        expect(dropdown).toBeDefined();
    });

    it('recursively updates nested children when filter and sorter are defined for child keys', () => {
        const nestedColumns: ColumnsType<RecordType<Resource>> = [
            {
                key: 'eventTime',
                title: 'Event Time',
                children: [
                    {
                        key: 'recorded',
                        dataIndex: 'recorded',
                        title: 'Entry or Change Time',
                        sorter: true,
                    },
                ],
            },
        ];

        const currentSorter = { columnKey: 'recorded', order: 'ascend' } as SorterResult;

        const result = populateTableColumnsWithFiltersAndSorts<Resource>({
            tableColumns: nestedColumns,
            filters: [
                {
                    column: { id: 'recorded', type: SearchBarColumnType.STRING, placeholder: 'Recorded' },
                    value: '2026-01-01',
                },
            ],
            sorters: [{ id: 'recorded', searchParam: 'date', label: 'Entry or Change Time' }],
            currentSorter,
            onChange,
        });

        expect(result).toHaveLength(1);
        expect(result[0]?.key).toBe('eventTime');
        expect(result[0]?.sorter).toBe(false);
        expect(result[0]?.sortOrder).toBeUndefined();
        expect(result[0]?.filterDropdown).toBeUndefined();
        expect(result[0]?.filtered).toBe(false);

        const firstColumn = result[0];
        const child = firstColumn && 'children' in firstColumn ? firstColumn.children?.[0] : undefined;
        expect(child?.key).toBe('recorded');
        expect(child?.sorter).toBe(true);
        expect(child?.sortOrder).toBe('ascend');
        expect(child?.filtered).toBe(true);
        expect(child?.filterDropdown).toBeDefined();
    });
});
