import { Radio } from 'antd';

import { useSolidChoiceColumn } from './hooks';
import { SearchBarColumnSolidChoiceTypeProps } from '../types';

export function SolidChoiceColumn(props: SearchBarColumnSolidChoiceTypeProps) {
    const { columnFilterValue } = props;
    const { options, defaultValue } = columnFilterValue.column;

    const { onSelect } = useSolidChoiceColumn(props);

    return (
        <Radio.Group defaultValue={defaultValue?.code} optionType="button" onChange={(e) => onSelect(e.target.value)}>
            {options.map((c) => (
                <Radio.Button key={c.code} value={c.code}>
                    {c.display}
                </Radio.Button>
            ))}
        </Radio.Group>
    );
}
