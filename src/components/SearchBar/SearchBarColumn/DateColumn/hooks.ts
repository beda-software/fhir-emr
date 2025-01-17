import moment from 'moment';
import { useCallback } from 'react';

import { DateColumnFilterValue } from 'src/components/SearchBar/types';

import { RangePickerOnChange } from './types';
import { SearchBarColumnDateTypeProps } from '../types';

export function useDateColumn(props: SearchBarColumnDateTypeProps) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback<RangePickerOnChange>(
        (values) => {
            if (values) {
                const momentValues = values.map((value) => moment(value!.format())) as DateColumnFilterValue;

                onChange(momentValues, columnFilterValue.column.id);
            } else {
                onChange(undefined, columnFilterValue.column.id);
            }
        },
        [onChange, columnFilterValue],
    );

    return { onColumnChange };
}
