import type { ColumnGroupType, ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { Resource } from 'fhir/r4b';

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

    const sorters: SorterColumn[] = [{ id: 'name', label: 'Name', searchParam: 'name' }];

    test('applies filtered state, sorter and current sort order', () => {
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

    test('recursively updates nested children when filter and sorter are defined for child keys', () => {
        const nestedColumns: ColumnsType<RecordType<Resource>> = [
            {
                key: 'parent-column',
                title: 'Parent Column',
                children: [
                    {
                        key: 'child-column',
                        dataIndex: 'child-column',
                        title: 'Child Column',
                    },
                    {
                        key: 'child-column-2',
                        dataIndex: 'child-column-2',
                        title: 'Child Column 2',
                    },
                ],
            },
        ];

        const currentSorter = { columnKey: 'child-column', order: 'ascend' } as SorterResult;

        const result = populateTableColumnsWithFiltersAndSorts<Resource>({
            tableColumns: nestedColumns,
            filters: [
                {
                    column: { id: 'child-column', type: SearchBarColumnType.STRING, placeholder: 'Child Column' },
                    value: '2026-01-01',
                },
            ],
            sorters: [{ id: 'child-column', searchParam: 'date', label: 'Child Column' }],
            currentSorter,
            onChange,
        });

        expect(result).toHaveLength(1);
        expect(result[0]?.key).toBe('parent-column');
        expect(result[0]?.sorter).toBe(false);
        expect(result[0]?.sortOrder).toBeUndefined();
        expect(result[0]?.filterDropdown).toBeUndefined();
        expect(result[0]?.filtered).toBe(false);

        const firstColumn = result[0] as ColumnGroupType<RecordType<Resource>>;
        const child_column = firstColumn.children?.[0];
        expect(child_column?.key).toBe('child-column');
        expect(child_column?.sorter).toBe(true);
        expect(child_column?.sortOrder).toBe('ascend');
        expect(child_column?.filtered).toBe(true);
        expect(child_column?.filterDropdown).toBeDefined();

        const child_column_2 = firstColumn.children?.[1];
        expect(child_column_2?.key).toBe('child-column-2');
        expect(child_column_2?.sorter).toBe(false);
        expect(child_column_2?.sortOrder).toBeUndefined();
        expect(child_column_2?.filtered).toBe(false);
        expect(child_column_2?.filterDropdown).toBeUndefined();
    });
});
