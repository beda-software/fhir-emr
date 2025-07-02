import { Radio } from 'antd';

import { useSolidChoiceColumn } from './hooks';
import { SearchBarColumnSolidChoiceTypeProps } from '../types';

export function SolidChoiceColumn(props: SearchBarColumnSolidChoiceTypeProps) {
    const { columnFilterValue } = props;
    const { value } = columnFilterValue;
    const { options } = columnFilterValue.column;

    const { onSelect } = useSolidChoiceColumn(props);

    return (
        // NOTE: Radio.Button defaultChecked and checked cannot be applied properly to check Coding value.
        <Radio.Group value={value?.[0]?.code} onChange={(e) => onSelect(e.target.value)}>
            {options.map((coding) => (
                <Radio.Button key={`radio-button-${coding.code}`} value={coding.code}>
                    {coding.display}
                </Radio.Button>
            ))}
        </Radio.Group>
    );
}
