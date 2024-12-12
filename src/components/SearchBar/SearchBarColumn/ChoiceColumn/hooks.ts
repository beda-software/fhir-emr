import _ from 'lodash';
import { useCallback, useContext } from 'react';
import { MultiValue, SingleValue } from 'react-select';

import { ValueSetExpandProvider } from 'src/contexts';
import { ValueSetOption } from 'src/services';

import { ChoiceColumnOption } from './types';
import { ChoiceTypeColumnFilterValue } from '../../types';
import { SearchBarColumnChoiceTypeProps } from '../types';

export function useChoiceColumn(props: SearchBarColumnChoiceTypeProps) {
    const { columnFilterValue, onChange } = props;
    const { id, valueSet, repeats } = columnFilterValue.column;
    const expand = useContext(ValueSetExpandProvider);

    const loadOptions = async (searchText: string) => {
        return expand(valueSet, searchText);
    };

    const debouncedLoadOptions = _.debounce((searchText: string, callback: (options: ChoiceColumnOption[]) => void) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    const onSelect = useCallback(
        (newValue: MultiValue<ChoiceColumnOption> | SingleValue<ChoiceColumnOption>) => {
            if (!newValue || (_.isArray(newValue) && newValue.length === 0)) {
                return onChange(null, id);
            }

            if (repeats) {
                const multiValue = newValue as ChoiceTypeColumnFilterValue['value'];
                return onChange(multiValue, id);
            }

            const singleValue = newValue as ValueSetOption;
            onChange([singleValue], id);
        },
        [id, onChange, repeats],
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
        debouncedLoadOptions,
    };
}
