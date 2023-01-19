import { t } from '@lingui/macro';
import { Col, Input } from 'antd';

import { useStringColumn } from './hooks';
import { SearchBarColumnProps } from '../types';

export function StringColumn<T>(props: SearchBarColumnProps<T>) {
    const { columnFilterValue } = props;

    const { onColumnChange } = useStringColumn<T>(props);

    return (
        <Col>
            <Input.Search
                placeholder={t`${columnFilterValue.column.placeholder}`}
                value={columnFilterValue.value as string}
                onChange={onColumnChange}
            />
        </Col>
    );
}
