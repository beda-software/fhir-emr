import { Col } from 'antd';

import { DatePicker } from 'src/components/DatePicker';

import { useDateColumn } from './hooks';
import { SearchBarColumnDateTypeProps } from '../types';

const { RangePicker } = DatePicker;

export function DateColumn<T>(props: SearchBarColumnDateTypeProps) {
    const { columnFilterValue } = props;

    const { onColumnChange } = useDateColumn<T>(props);

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
