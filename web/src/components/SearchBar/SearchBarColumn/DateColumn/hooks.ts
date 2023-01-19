import moment from 'moment';
import { DatePicker } from 'antd';
import { useCallback } from 'react';
import { DateColumnFilterValue } from 'src/components/SearchBar/types';

import { SearchBarColumnProps } from '../types';

type RangeValue = Parameters<
    NonNullable<React.ComponentProps<typeof DatePicker.RangePicker>['onChange']>
>[0];

export function useDateColumn<T>(props: SearchBarColumnProps<T>) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback(
        (values: RangeValue) => {
            if (values) {
                const momentValues = values.map((value) =>
                    moment(value!.format()),
                ) as DateColumnFilterValue;

                onChange(momentValues, columnFilterValue.column.id);
            }
        },
        [onChange, columnFilterValue],
    );

    return { onColumnChange };
}
