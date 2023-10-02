import { DateColumn } from './DateColumn';
import { ReferenceColumn } from './ReferenceColumn';
import { StringColumn } from './StringColumn';
import {
    SearchBarColumnDateTypeProps,
    SearchBarColumnProps,
    SearchBarColumnReferenceTypeProps,
    SearchBarColumnStringTypeProps,
} from './types';

export function SearchBarColumn<T>(props: SearchBarColumnProps<T>) {
    const { columnFilterValue } = props;

    switch (columnFilterValue.column.type) {
        case 'string':
            return <StringColumn<T> {...(props as SearchBarColumnStringTypeProps)} />;
        case 'date':
            return <DateColumn<T> {...(props as SearchBarColumnDateTypeProps)} />;
        case 'reference':
            return <ReferenceColumn {...(props as SearchBarColumnReferenceTypeProps)} />;
        default:
            return null;
    }
}
