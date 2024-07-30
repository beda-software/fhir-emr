import { useCallback } from 'react';

import { SearchBarColumnStringTypeProps } from 'src/components/SearchBar/SearchBarColumn/types';

export function useStringColumn(props: SearchBarColumnStringTypeProps) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value, columnFilterValue.column.id);
        },
        [onChange, columnFilterValue],
    );

    return { onColumnChange };
}
