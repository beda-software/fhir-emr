import { Col } from 'antd';

import { Select } from 'src/components/Select';
import { ValueSetOption } from 'src/services';

import { SearchBarColumnChoiceTypeProps } from '../../types';
import { useChoiceColumn } from '../hooks';

export function SelectChoiceColumn(props: SearchBarColumnChoiceTypeProps) {
    const { columnFilterValue } = props;
    const { options, placeholder, repeats } = columnFilterValue.column;

    const { onSelect, getOptionLabel, isOptionSelected } = useChoiceColumn(props);

    return (
        <Col>
            <Select<ValueSetOption>
                value={columnFilterValue.value}
                options={options}
                onChange={onSelect}
                isOptionSelected={isOptionSelected}
                isMulti={repeats}
                getOptionLabel={getOptionLabel}
                classNamePrefix="react-select"
                placeholder={placeholder}
            />
        </Col>
    );
}
