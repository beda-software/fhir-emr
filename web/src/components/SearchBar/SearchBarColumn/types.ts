import { ColumnFilterValue } from '../types';

export interface SearchBarColumnProps<T> {
    columnFilterValue: ColumnFilterValue<T>;
    onChange: (value: string, key: string) => void;
}
