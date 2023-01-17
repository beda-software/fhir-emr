import { t } from '@lingui/macro';
import { Col, DatePicker, Input } from 'antd';

import { useSearchBarColumn } from './hooks';
import { SearchBarColumnProps } from './types';

const { RangePicker } = DatePicker;

export function SearchBarColumn<T>(props: SearchBarColumnProps<T>) {
    const { columnFilterValue } = props;

    const { onSearchColumnChange } = useSearchBarColumn<T>(props);

    if (columnFilterValue.column.type === 'string') {
        return (
            <Col>
                <Input.Search
                    placeholder={t`${columnFilterValue.column.placeholder}`}
                    value={columnFilterValue.value}
                    onChange={onSearchColumnChange}
                />
            </Col>
        );
    }

    if (columnFilterValue.column.type === 'date') {
        return (
            <Col>
                <RangePicker placeholder={[t`Start date`, t`End date`]} />
            </Col>
        );
    }

    return null;
}
