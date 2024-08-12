import { SelectChoiceColumn } from './SelectChoiceColumn';
import { ValueSetColumn } from './ValueSetColumn';
import { SearchBarColumnChoiceTypeProps } from '../types';

export function ChoiceColumn(props: SearchBarColumnChoiceTypeProps) {
    const { columnFilterValue } = props;
    const { valueSet } = columnFilterValue.column;

    if (valueSet) {
        return <ValueSetColumn {...props} />;
    }

    return <SelectChoiceColumn {...props} />;
}
