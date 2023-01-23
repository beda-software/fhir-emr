import { t } from '@lingui/macro';
import { Col } from 'antd';

import { DateColumnFilterValue } from 'src/components/SearchBar/types';
import { DatePicker } from 'src/components/DatePicker';

import { useDateColumn } from './hooks';
import { SearchBarColumnProps } from '../types';

const { RangePicker } = DatePicker;

export function DateColumn<T>(props: SearchBarColumnProps<T>) {
    const { columnFilterValue } = props;

    const { onColumnChange } = useDateColumn<T>(props);

    return (
        <Col>
            <RangePicker
                placeholder={[t`Start date`, t`End date`]}
                value={columnFilterValue.value as DateColumnFilterValue}
                onChange={onColumnChange}
            />
        </Col>
    );
}
