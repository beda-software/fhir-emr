import { Col } from 'antd';

import { DatePicker } from 'src/components/DatePicker';
import { SearchBarColumnDateTypeProps } from 'src/components/SearchBar/SearchBarColumn/types';

import { useDateColumn } from './hooks';

const { RangePicker } = DatePicker;

export function DateColumn(props: SearchBarColumnDateTypeProps) {
    const { columnFilterValue } = props;

    const { onColumnChange } = useDateColumn(props);

    return (
        <Col>
            <RangePicker
                placeholder={columnFilterValue.column.placeholder}
                value={columnFilterValue.value}
                onChange={onColumnChange}
            />
        </Col>
    );
}
