import { ChoiceColumn } from './ChoiceColumn';
import { DateColumn } from './DateColumn';
import { ReferenceColumn } from './ReferenceColumn';
import { StringColumn } from './StringColumn';
import { SearchBarColumnProps } from './types';
import {
    isStringColumnFilterValue,
    isDateColumnFilterValue,
    isReferenceColumnFilterValue,
    isChoiceColumnFilterValue,
} from '../types';

export function SearchBarColumn(props: SearchBarColumnProps) {
    const { columnFilterValue } = props;

    if (isStringColumnFilterValue(columnFilterValue)) {
        const stringProps = {
            ...props,
            columnFilterValue,
        };
        return <StringColumn {...stringProps} />;
    }

    if (isDateColumnFilterValue(columnFilterValue)) {
        const dateProps = {
            ...props,
            columnFilterValue,
        };
        return <DateColumn {...dateProps} />;
    }

    if (isReferenceColumnFilterValue(columnFilterValue)) {
        const referenceProps = {
            ...props,
            columnFilterValue,
        };
        return <ReferenceColumn {...referenceProps} />;
    }

    if (isChoiceColumnFilterValue(columnFilterValue)) {
        const choiceProps = {
            ...props,
            columnFilterValue,
        };
        return <ChoiceColumn {...choiceProps} />;
    }

    return null;
}
