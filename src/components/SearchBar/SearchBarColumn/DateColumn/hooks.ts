import { NoUndefinedRangeValueType } from 'rc-picker/lib/PickerInput/RangePicker';
import moment from 'moment';
import { useCallback } from 'react';

import { DateColumnFilterValue } from 'src/components/SearchBar/types';

import { RangePickerOnChange } from './types';
import { SearchBarColumnDateTypeProps } from '../types';

export function useDateColumn(props: SearchBarColumnDateTypeProps) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback<RangePickerOnChange>(
        (dates: NoUndefinedRangeValueType<moment.Moment> | null, dateStrings: [string, string]) => {
            if (dates) {
                const momentValues = dates.map((date) => moment(date!.format())) as DateColumnFilterValue;

                onChange(momentValues, columnFilterValue.column.id);
            } else {
                onChange(undefined, columnFilterValue.column.id);
            }
        },
        [onChange, columnFilterValue],
    );

    return { onColumnChange };
}
