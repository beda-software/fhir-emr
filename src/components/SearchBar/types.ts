import { Expression, Resource, QuestionnaireItemChoiceColumn, ValueSet } from '@beda.software/aidbox-types';

import { ValueSetOption } from 'src/services';
import { LoadResourceOption } from 'src/services/questionnaire';

export enum SearchBarColumnType {
    STRING = 'string',
    DATE = 'date',
    REFERENCE = 'reference',
    CHOICE = 'choice',
}

export interface SearchBarProps {
    columns: SearchBarColumn[];
}

type SearchBarColumnBase = {
    id: string;
    searchParam?: string;
};

export type SearchBarStringColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.STRING;
    placeholder: string;
};
export type SearchBarDateColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.DATE;
    placeholder: [string, string];
};
export type SearchBarReferenceColumn = SearchBarColumnBase & {
    id: string;
    type: SearchBarColumnType.REFERENCE;
    expression: Expression['expression'];
    path: QuestionnaireItemChoiceColumn['path'];
    placeholder: string;
};
export type SearchBarChoiceColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.CHOICE;
    repeats?: boolean;
    placeholder: string;
} & (
        | {
              options: ValueSetOption[];
              valueSet?: never;
          }
        | {
              options?: never;
              valueSet: ValueSet['id'];
          }
    );

export type SearchBarColumn =
    | SearchBarStringColumn
    | SearchBarDateColumn
    | SearchBarReferenceColumn
    | SearchBarChoiceColumn;
export function isStringColumn(column: SearchBarColumn): column is SearchBarStringColumn {
    return column.type === SearchBarColumnType.STRING;
}
export function isDateColumn(column: SearchBarColumn): column is SearchBarDateColumn {
    return column.type === SearchBarColumnType.DATE;
}
export function isReferenceColumn(column: SearchBarColumn): column is SearchBarReferenceColumn {
    return column.type === SearchBarColumnType.REFERENCE;
}
export function isChoiceColumn(column: SearchBarColumn): column is SearchBarChoiceColumn {
    return column.type === SearchBarColumnType.CHOICE;
}

export type DateColumnFilterValue = [moment.Moment, moment.Moment];

export interface StringTypeColumnFilterValue {
    column: SearchBarStringColumn;
    value?: string;
}
export interface DateTypeColumnFilterValue {
    column: SearchBarDateColumn;
    value?: DateColumnFilterValue;
}
export interface ReferenceTypeColumnFilterValue {
    column: SearchBarReferenceColumn;
    value?: LoadResourceOption<Resource> | null;
}
export interface ChoiceTypeColumnFilterValue {
    column: SearchBarChoiceColumn;
    value?: ValueSetOption[] | null;
}

export type ColumnFilterValue =
    | StringTypeColumnFilterValue
    | DateTypeColumnFilterValue
    | ReferenceTypeColumnFilterValue
    | ChoiceTypeColumnFilterValue;
export function isStringColumnFilterValue(filterValue: ColumnFilterValue): filterValue is StringTypeColumnFilterValue {
    return isStringColumn(filterValue.column);
}
export function isDateColumnFilterValue(filterValue: ColumnFilterValue): filterValue is DateTypeColumnFilterValue {
    return isDateColumn(filterValue.column);
}
export function isReferenceColumnFilterValue(
    filterValue: ColumnFilterValue,
): filterValue is ReferenceTypeColumnFilterValue {
    return isReferenceColumn(filterValue.column);
}
export function isChoiceColumnFilterValue(filterValue: ColumnFilterValue): filterValue is ChoiceTypeColumnFilterValue {
    return isChoiceColumn(filterValue.column);
}

export interface SearchBarData {
    columnsFilterValues: ColumnFilterValue[];
    onChangeColumnFilter: (value: ColumnFilterValue['value'], key: string) => void;
    onResetFilters: () => void;
}
