import { DatePicker } from 'src/components/DatePicker';

import { useDateColumn } from './hooks';
import { SearchBarColumnSingleDateTypeProps } from '../types';

export function DateSingleColumn(props: SearchBarColumnSingleDateTypeProps) {
    const { columnFilterValue, defaultOpen } = props;
    const { placeholder } = columnFilterValue.column;
    const { onColumnChange } = useDateColumn(props);

    return (
        <DatePicker
            showTime={false}
            onChange={onColumnChange}
            value={columnFilterValue.value}
            placeholder={placeholder}
            defaultOpen={defaultOpen}
            allowClear
        />
    );
}
