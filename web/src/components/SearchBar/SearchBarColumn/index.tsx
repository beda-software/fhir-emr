import { DateColumn } from './DateColumn';
import { StringColumn } from './StringColumn';
import { SearchBarColumnProps } from './types';

export function SearchBarColumn<T>(props: SearchBarColumnProps<T>) {
    const { columnFilterValue } = props;

    switch (columnFilterValue.column.type) {
        case 'string':
            return <StringColumn {...props} />;
        case 'date':
            return <DateColumn {...props} />;
        default:
            return null;
    }
}
