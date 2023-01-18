import { useCallback } from 'react';

import { SearchBarColumnProps } from '../types';

export function useStringColumn<T>(props: SearchBarColumnProps<T>) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value, columnFilterValue.column.id);
        },
        [onChange, columnFilterValue],
    );

    return { onColumnChange };
}
