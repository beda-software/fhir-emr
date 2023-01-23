import moment from 'moment';
import { useCallback } from 'react';
import { DateColumnFilterValue } from 'src/components/SearchBar/types';

import { SearchBarColumnDateTypeProps } from '../types';
import { RangePickerOnChange } from './types';

export function useDateColumn<T>(props: SearchBarColumnDateTypeProps<T>) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback<RangePickerOnChange>(
        (values) => {
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
