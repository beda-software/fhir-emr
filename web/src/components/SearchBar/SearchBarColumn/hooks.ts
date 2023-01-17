import { useCallback } from 'react';

import { SearchBarColumnProps } from './types';

export function useSearchBarColumn<T>(props: SearchBarColumnProps<T>) {
    const { onChange, columnFilterValue } = props;

    const onSearchColumnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value, columnFilterValue.column.id);
        },
        [onChange, columnFilterValue],
    );

    return { onSearchColumnChange };
}
