import { Input } from 'antd';

import { useStringColumn } from './hooks';
import { SearchBarColumnStringTypeProps } from '../types';

export function StringColumn(props: SearchBarColumnStringTypeProps) {
    const { columnFilterValue } = props;

    const { onColumnChange } = useStringColumn(props);

    return (
        <Input.Search
            placeholder={columnFilterValue.column.placeholder}
            value={columnFilterValue.value}
            onChange={onColumnChange}
            allowClear
        />
    );
}
