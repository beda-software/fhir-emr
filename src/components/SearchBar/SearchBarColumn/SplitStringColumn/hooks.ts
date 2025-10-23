import { useCallback } from 'react';

import { SearchBarColumnSplitStringTypeProps } from '../types';

export function useSplitStringColumn(props: SearchBarColumnSplitStringTypeProps) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value, columnFilterValue.column.id);
        },
        [onChange, columnFilterValue],
    );

    return { onColumnChange };
}
