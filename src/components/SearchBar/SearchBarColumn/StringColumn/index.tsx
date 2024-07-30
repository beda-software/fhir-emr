import { Col, Input } from 'antd';

import { SearchBarColumnStringTypeProps } from 'src/components/SearchBar/SearchBarColumn/types';

import { useStringColumn } from './hooks';

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
