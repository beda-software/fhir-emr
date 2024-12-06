import { ChoiceColumn } from './ChoiceColumn';
import { DateColumn } from './DateColumn';
import { DateSingleColumn } from './DateSingleColumn';
import { ReferenceColumn } from './ReferenceColumn';
import { SolidChoiceColumn } from './SolidChoiceColumn';
import { StringColumn } from './StringColumn';
import { SearchBarColumnProps } from './types';
import {
    isStringColumnFilterValue,
    isDateColumnFilterValue,
    isReferenceColumnFilterValue,
    isChoiceColumnFilterValue,
    isSolidChoiceColumnFilterValue,
    isSingleDateColumnFilterValue,
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

    if (isSingleDateColumnFilterValue(columnFilterValue)) {
        const dateProps = {
            ...props,
            columnFilterValue,
        };
        return <DateSingleColumn {...dateProps} />;
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

    if (isSolidChoiceColumnFilterValue(columnFilterValue)) {
        const choiceProps = {
            ...props,
            columnFilterValue,
        };

        return <SolidChoiceColumn {...choiceProps} />;
    }

    return null;
}
