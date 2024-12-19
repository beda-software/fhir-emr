import _ from 'lodash';
import { useCallback } from 'react';

import { ValueSetOption } from 'src/services';

import { ChoiceColumnOption } from './types';
import { SearchBarColumnSolidChoiceTypeProps } from '../types';

export function useSolidChoiceColumn(props: SearchBarColumnSolidChoiceTypeProps) {
    const { columnFilterValue, onChange } = props;
    const { id, options } = columnFilterValue.column;

    const onSelect = useCallback(
        (code: string) => {
            if (!code) {
                return onChange(null, id);
            }

            const option = options.find((o) => o.code === code);

            if (!option) {
                return onChange(null, id);
            }

            onChange([option], id);
        },
        [id, options, onChange],
    );

    const isOptionSelected = (option: ChoiceColumnOption) => {
        return !!columnFilterValue.value && columnFilterValue.value?.findIndex((v) => _.isEqual(v, option)) !== -1;
    };

    const getOptionLabel = (option: ValueSetOption) => {
        return option?.value?.Coding?.display || '';
    };

    return {
        onSelect,
        isOptionSelected,
        getOptionLabel,
    };
}
