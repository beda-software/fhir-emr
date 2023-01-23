import { DateColumn } from './DateColumn';
import { StringColumn } from './StringColumn';
import {
    SearchBarColumnDateTypeProps,
    SearchBarColumnProps,
    SearchBarColumnStringTypeProps,
} from './types';

export function SearchBarColumn<T>(props: SearchBarColumnProps<T>) {
    const { columnFilterValue } = props;

    switch (columnFilterValue.column.type) {
        case 'string':
            return <StringColumn<T> {...(props as SearchBarColumnStringTypeProps<T>)} />;
        case 'date':
            return <DateColumn<T> {...(props as SearchBarColumnDateTypeProps<T>)} />;
        default:
            return null;
    }
}
