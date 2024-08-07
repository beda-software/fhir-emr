import { Col, Input } from 'antd';

import { useStringColumn } from './hooks';
import { SearchBarColumnStringTypeProps } from '../types';

export function StringColumn(props: SearchBarColumnStringTypeProps) {
    const { columnFilterValue } = props;

    const { onColumnChange } = useStringColumn(props);

    return (
        <Col>
            <Input.Search
                placeholder={columnFilterValue.column.placeholder}
                value={columnFilterValue.value}
                onChange={onColumnChange}
            />
        </Col>
    );
}
