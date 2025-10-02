import { Input } from 'antd';

import { useSplitStringColumn } from './hooks';
import { SearchBarColumnSplitStringTypeProps } from '../types';

export function SplitStringColumn(props: SearchBarColumnSplitStringTypeProps) {
    const { columnFilterValue } = props;

    const { onColumnChange } = useSplitStringColumn(props);

    return (
        <Input.Search
            placeholder={columnFilterValue.column.placeholder}
            value={columnFilterValue.value}
            onChange={onColumnChange}
            allowClear
        />
    );
}
