import { AsyncSelect } from 'src/components/Select';

import { SearchBarColumnChoiceTypeProps } from '../../types';
import { useChoiceColumn } from '../hooks';

export function ValueSetColumn(props: SearchBarColumnChoiceTypeProps) {
    const { columnFilterValue, defaultOpen } = props;
    const { placeholder, repeats } = columnFilterValue.column;

    const { onSelect, isOptionSelected, getOptionLabel, debouncedLoadOptions } = useChoiceColumn(props);

    return (
        <AsyncSelect
            defaultOptions
            loadOptions={debouncedLoadOptions}
            value={columnFilterValue.value}
            isMulti={repeats}
            onChange={onSelect}
            isOptionSelected={isOptionSelected}
            getOptionLabel={getOptionLabel}
            placeholder={placeholder}
            defaultMenuIsOpen={defaultOpen}
            isClearable
        />
    );
}
