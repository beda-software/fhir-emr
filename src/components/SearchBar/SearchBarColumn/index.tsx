import {
    isStringColumnFilterValue,
    isDateColumnFilterValue,
    isReferenceColumnFilterValue,
} from 'src/components/SearchBar/types';

import { DateColumn } from './DateColumn';
import { ReferenceColumn } from './ReferenceColumn';
import { StringColumn } from './StringColumn';
import {
    SearchBarColumnDateTypeProps,
    SearchBarColumnProps,
    SearchBarColumnReferenceTypeProps,
    SearchBarColumnStringTypeProps,
} from './types';

export function SearchBarColumn(props: SearchBarColumnProps) {
    const { columnFilterValue } = props;

    if (isStringColumnFilterValue(columnFilterValue)) {
        return <StringColumn {...(props as SearchBarColumnStringTypeProps)} />;
    }

    if (isDateColumnFilterValue(columnFilterValue)) {
        return <DateColumn {...(props as SearchBarColumnDateTypeProps)} />;
    }

    if (isReferenceColumnFilterValue(columnFilterValue)) {
        return <ReferenceColumn {...(props as SearchBarColumnReferenceTypeProps)} />;
    }

    return null;
}
