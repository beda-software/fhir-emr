import { useCallback } from 'react';

import { OptionType, MultiValue, SingleValue } from './types';
import { SearchBarColumnReferenceTypeProps } from '../types';

export function useReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const { onChange, columnFilterValue } = props;

    const onColumnChange = useCallback(
        (selectedOption: MultiValue<OptionType> | SingleValue<OptionType>) => {
            if (Array.isArray(selectedOption)) {
                const values = selectedOption.map((option) => option.value).join(',');
                onChange(values, columnFilterValue.column.id);
            } else if (typeof selectedOption === 'object' && selectedOption !== null && 'value' in selectedOption) {
                onChange(selectedOption.value, columnFilterValue.column.id);
            }
        },
        [onChange, columnFilterValue],
    );

    return { onColumnChange };
}
