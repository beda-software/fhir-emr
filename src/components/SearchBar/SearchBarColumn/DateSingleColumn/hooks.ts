import moment from 'moment';
import { useCallback } from 'react';

import { SearchBarColumnSingleDateTypeProps } from '../types';

export function useDateColumn(props: SearchBarColumnSingleDateTypeProps) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback(
        (value: moment.Moment | null) => {
            if (value) {
                onChange(value, columnFilterValue.column.id);
            } else {
                onChange(undefined, columnFilterValue.column.id);
            }
        },
        [onChange, columnFilterValue],
    );

    return { onColumnChange };
}
