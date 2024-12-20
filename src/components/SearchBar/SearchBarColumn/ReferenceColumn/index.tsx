import { AsyncSelect } from 'src/components/Select';
import { getAnswerCode, getAnswerDisplay } from 'src/utils/questionnaire';

import { useReferenceColumn } from './hooks';
import { SearchBarColumnReferenceTypeProps } from '../types';

export function ReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const { columnFilterValue, defaultOpen } = props;

    const { debouncedLoadOptions, onOptionChange } = useReferenceColumn(props);

    return (
        <AsyncSelect
            onChange={onOptionChange}
            value={columnFilterValue.value}
            loadOptions={debouncedLoadOptions}
            defaultOptions
            getOptionLabel={(option) => getAnswerDisplay(option.value)}
            getOptionValue={(option) => getAnswerCode(option.value)}
            isMulti={false}
            placeholder={columnFilterValue.column.placeholder}
            defaultMenuIsOpen={defaultOpen}
            isClearable
        />
    );
}
