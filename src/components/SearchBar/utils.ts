import { formatFHIRDateTime } from '@beda.software/fhir-react';

import {
    ColumnFilterValue,
    isChoiceColumnFilterValue,
    isDateColumnFilterValue,
    isReferenceColumnFilterValue,
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

    if (isStringColumnFilterValue(filterValue)) {
        return filterValue.value;
    }

    if (isDateColumnFilterValue(filterValue)) {
        return filterValue.value
            ? [`ge${formatFHIRDateTime(filterValue.value[0])}`, `le${formatFHIRDateTime(filterValue.value[1])}`]
            : undefined;
    }

    if (isReferenceColumnFilterValue(filterValue)) {
        return filterValue.value?.value.Reference.id;
    }

    if (isChoiceColumnFilterValue(filterValue)) {
        return filterValue.value?.map((option) => option.value.Coding.code!);
    }

    throw new Error('Unsupported column type');
}
