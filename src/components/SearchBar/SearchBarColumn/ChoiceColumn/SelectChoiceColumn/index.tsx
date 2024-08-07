import _ from 'lodash';

import { Select } from 'src/components/Select';

import { SearchBarColumnChoiceTypeProps } from '../../types';
import { useChoiceColumn } from '../hooks';
import { ChoiceColumnOption } from '../types';

export function SelectChoiceColumn(props: SearchBarColumnChoiceTypeProps) {
    const { columnFilterValue } = props;
    const { options, placeholder, repeats } = columnFilterValue.column;

    const { onSelect } = useChoiceColumn(props);

    return (
        <Select<ChoiceColumnOption>
            value={columnFilterValue.value}
            options={options}
            onChange={onSelect}
            isOptionSelected={(option) =>
                !!columnFilterValue.value &&
                columnFilterValue.value?.findIndex((v) => _.isEqual(v?.value, option)) !== -1
            }
            isMulti={repeats}
            getOptionLabel={(o) => String(o)}
            classNamePrefix="react-select"
            placeholder={placeholder}
        />
    );
}
