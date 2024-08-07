import _ from 'lodash';
import AsyncSelect from 'react-select/async';

import { SearchBarColumnChoiceTypeProps } from '../../types';
import { useChoiceColumn } from '../hooks';

export function ValueSetColumn(props: SearchBarColumnChoiceTypeProps) {
    const { columnFilterValue } = props;
    const { placeholder, repeats } = columnFilterValue.column;

    const { onSelect, getLabel, debouncedLoadOptions } = useChoiceColumn(props);

    return (
        <AsyncSelect
            loadOptions={debouncedLoadOptions}
            defaultOptions
            value={columnFilterValue.value}
            isMulti={repeats}
            onChange={onSelect}
            isOptionSelected={(option) =>
                !!columnFilterValue.value &&
                columnFilterValue.value?.findIndex((v) => _.isEqual(v?.value, option.value)) !== -1
            }
            getOptionLabel={getLabel}
            placeholder={placeholder}
        />
    );
}
