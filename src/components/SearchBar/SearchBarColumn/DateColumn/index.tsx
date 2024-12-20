import { DatePicker } from 'src/components/DatePicker';

import { useDateColumn } from './hooks';
import { SearchBarColumnDateTypeProps } from '../types';

const { RangePicker } = DatePicker;

export function DateColumn(props: SearchBarColumnDateTypeProps) {
    const { columnFilterValue, defaultOpen } = props;

    const { onColumnChange } = useDateColumn(props);

    return (
        <RangePicker
            placeholder={columnFilterValue.column.placeholder}
            value={columnFilterValue.value}
            onChange={onColumnChange}
            defaultOpen={defaultOpen}
            allowClear
        />
    );
}
