import { Select } from 'src/components/Select';
import { ValueSetOption } from 'src/services';

import { SearchBarColumnChoiceTypeProps } from '../../types';
import { useChoiceColumn } from '../hooks';

export function SelectChoiceColumn(props: SearchBarColumnChoiceTypeProps) {
    const { columnFilterValue, defaultOpen } = props;
    const { options, placeholder, repeats } = columnFilterValue.column;

    const { onSelect, getOptionLabel, isOptionSelected } = useChoiceColumn(props);

    return (
        <Select<ValueSetOption>
            value={columnFilterValue.value}
            options={options}
            onChange={onSelect}
            isOptionSelected={isOptionSelected}
            isMulti={repeats}
            getOptionLabel={getOptionLabel}
            classNamePrefix="react-select"
            placeholder={placeholder}
            defaultMenuIsOpen={defaultOpen}
            isClearable
        />
    );
}
