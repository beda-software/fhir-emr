import { formatFHIRDate, formatFHIRDateTime } from '@beda.software/fhir-react';

import {
    ColumnFilterValue,
    isChoiceColumnFilterValue,
    isDateColumnFilterValue,
    isReferenceColumnFilterValue,
    isSingleDateColumnFilterValue,
    isSolidChoiceColumnFilterValue,
    isStringColumnFilterValue,
    SearchBarColumn,
} from './types';

export function getSearchBarFilterValue(filterValues: ColumnFilterValue[] | undefined, id: SearchBarColumn['id']) {
    if (!filterValues) {
        return undefined;
    }

    const filterValue = filterValues.find((filterValue) => filterValue.column.id === id);
    if (!filterValue) {
        throw new Error('Filter value not found');
    }

    return getSearchBarColumnFilterValue(filterValue);
}

export function getSearchBarColumnFilterValue(filterValue: ColumnFilterValue) {
    if (isStringColumnFilterValue(filterValue)) {
        return filterValue.value;
    }

    if (isDateColumnFilterValue(filterValue)) {
        return filterValue.value
            ? [`ge${formatFHIRDateTime(filterValue.value[0])}`, `le${formatFHIRDateTime(filterValue.value[1])}`]
            : undefined;
    }

    if (isSingleDateColumnFilterValue(filterValue)) {
        return filterValue.value ? formatFHIRDate(filterValue.value) : undefined;
    }

    if (isReferenceColumnFilterValue(filterValue)) {
        return filterValue.value?.value.Reference.id;
    }

    if (isChoiceColumnFilterValue(filterValue)) {
        return filterValue.value?.map((option) => option.value.Coding.code!);
    }

    if (isSolidChoiceColumnFilterValue(filterValue)) {
        return filterValue.value?.map((option) => option.code!);
    }

    throw new Error('Unsupported column type');
}

export function isSearchBarFilter(filter: ColumnFilterValue) {
    const { placement = ['search-bar'] } = filter.column;

    return placement.includes('search-bar');
}

export function isTableFilter(filter: ColumnFilterValue) {
    const { placement = ['search-bar'] } = filter.column;

    return placement.includes('table');
}
