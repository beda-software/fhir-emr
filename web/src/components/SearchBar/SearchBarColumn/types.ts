import { ColumnFilterValue, DateColumnFilterValue } from '../types';

export interface SearchBarColumnProps<T> {
    columnFilterValue: ColumnFilterValue<T>;
    onChange: (value: DateColumnFilterValue | string, key: string) => void;
}
