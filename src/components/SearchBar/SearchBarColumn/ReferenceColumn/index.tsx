import { Col } from 'antd';

import { SearchBarColumnReferenceTypeProps } from 'src/components/SearchBar/SearchBarColumn/types';
import { AsyncSelect } from 'src/components/Select';
import { getAnswerCode, getAnswerDisplay } from 'src/utils/questionnaire';

import { useReferenceColumn } from './hooks';

export function ReferenceColumn(props: SearchBarColumnReferenceTypeProps) {
    const { columnFilterValue } = props;

    const { debouncedLoadOptions, onOptionChange } = useReferenceColumn(props);

    return (
        <Col>
            <AsyncSelect
                onChange={onOptionChange}
                value={columnFilterValue.value}
                loadOptions={debouncedLoadOptions}
                defaultOptions
                getOptionLabel={(option) => getAnswerDisplay(option.value)}
                getOptionValue={(option) => getAnswerCode(option.value)}
                isMulti={false}
                placeholder={columnFilterValue.column.placeholder}
            />
        </Col>
    );
}
