import { t } from '@lingui/macro';
import { Col, DatePicker } from 'antd';

import { DateColumnFilterValue } from 'src/components/SearchBar/types';

import { SearchBarColumnProps } from '../types';
import { useDateColumn } from './hooks';

const { RangePicker } = DatePicker;

export function DateColumn<T>(props: SearchBarColumnProps<T>) {
    const { columnFilterValue } = props;

    const { onColumnChange } = useDateColumn<T>(props);

    return (
        <Col>
            <RangePicker
                placeholder={[t`Start date`, t`End date`]}
                // TODO: Update antd to make it works with moment date types instead of dayjs
                // @ts-ignore
                value={columnFilterValue.value as DateColumnFilterValue}
                onChange={onColumnChange}
            />
        </Col>
    );
}
