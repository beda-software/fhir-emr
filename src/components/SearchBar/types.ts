import { Coding } from 'fhir/r4b';

import {
    Expression,
    Resource,
    QuestionnaireItemChoiceColumn,
    ValueSet,
    AidboxReference,
} from '@beda.software/aidbox-types';

import { ValueSetOption } from 'src/services';
import { LoadResourceOption } from 'src/services/questionnaire';

export enum SearchBarColumnType {
    STRING = 'string',
    DATE = 'date',
    SINGLEDATE = 'singleDate',
    REFERENCE = 'reference',
    CHOICE = 'choice',
    SOLIDCHOICE = 'solidChoice',
}

export interface SearchBarProps {
    columns: SearchBarColumn[];
}

type SearchBarColumnBase = {
    // if placement is table then id should be matched with table column key
    id: string;
    searchParam?: string;
    // placement = 'search-bar' by default
    placement?: Array<'search-bar' | 'table'>;
};

export type SearchBarStringColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.STRING;
    placeholder: string;
};
export type SearchBarDateColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.DATE;
    placeholder: [string, string];
};
export type SearchBarSingleDateColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.SINGLEDATE;
    placeholder: string;
    defaultValue?: moment.Moment;
};
export type SearchBarReferenceColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.REFERENCE;
    expression: Expression['expression'];
    path: QuestionnaireItemChoiceColumn['path'];
    placeholder: string;
    defaultValue?: AidboxReference;
};
export type SearchBarChoiceColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.CHOICE;
    repeats?: boolean;
    placeholder: string;
    defaultValue?: ValueSetOption;
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

export type SearchBarSolidChoiceColumn = SearchBarColumnBase & {
    type: SearchBarColumnType.SOLIDCHOICE;
    repeats?: boolean;
    placeholder: string;
    options: Coding[];
    valueSet?: never;
    defaultValue?: Coding;
};

export type SearchBarColumn =
    | SearchBarStringColumn
    | SearchBarDateColumn
    | SearchBarSingleDateColumn
    | SearchBarReferenceColumn
    | SearchBarChoiceColumn
    | SearchBarSolidChoiceColumn;
export function isStringColumn(column: SearchBarColumn): column is SearchBarStringColumn {
    return column.type === SearchBarColumnType.STRING;
}
export function isDateColumn(column: SearchBarColumn): column is SearchBarDateColumn {
    return column.type === SearchBarColumnType.DATE;
}
export function isSingleDateColumn(column: SearchBarColumn): column is SearchBarSingleDateColumn {
    return column.type === SearchBarColumnType.SINGLEDATE;
}
export function isReferenceColumn(column: SearchBarColumn): column is SearchBarReferenceColumn {
    return column.type === SearchBarColumnType.REFERENCE;
}
export function isChoiceColumn(column: SearchBarColumn): column is SearchBarChoiceColumn {
    return column.type === SearchBarColumnType.CHOICE;
}
export function isSolidChoiceColumn(column: SearchBarColumn): column is SearchBarSolidChoiceColumn {
    return column.type === SearchBarColumnType.SOLIDCHOICE;
}

export type DateColumnFilterValue = [moment.Moment, moment.Moment];
export type SingleDateColumnFilterValue = moment.Moment;

export interface StringTypeColumnFilterValue {
    column: SearchBarStringColumn;
    value?: string;
}
export interface DateTypeColumnFilterValue {
    column: SearchBarDateColumn;
    value?: DateColumnFilterValue;
}

export interface SingleDateTypeColumnFilterValue {
    column: SearchBarSingleDateColumn;
    value?: SingleDateColumnFilterValue;
}
export interface ReferenceTypeColumnFilterValue {
    column: SearchBarReferenceColumn;
    value?: LoadResourceOption<Resource> | null;
}
export interface ChoiceTypeColumnFilterValue {
    column: SearchBarChoiceColumn;
    value?: ValueSetOption[] | null;
}

export interface SolidChoiceTypeColumnFilterValue {
    column: SearchBarSolidChoiceColumn;
    value?: Coding[] | null;
}

export type ColumnFilterValue =
    | StringTypeColumnFilterValue
    | DateTypeColumnFilterValue
    | SingleDateTypeColumnFilterValue
    | ReferenceTypeColumnFilterValue
    | ChoiceTypeColumnFilterValue
    | SolidChoiceTypeColumnFilterValue;
export function isStringColumnFilterValue(filterValue: ColumnFilterValue): filterValue is StringTypeColumnFilterValue {
    return isStringColumn(filterValue.column);
}
export function isDateColumnFilterValue(filterValue: ColumnFilterValue): filterValue is DateTypeColumnFilterValue {
    return isDateColumn(filterValue.column);
}
export function isSingleDateColumnFilterValue(
    filterValue: ColumnFilterValue,
): filterValue is SingleDateTypeColumnFilterValue {
    return isSingleDateColumn(filterValue.column);
}
export function isReferenceColumnFilterValue(
    filterValue: ColumnFilterValue,
): filterValue is ReferenceTypeColumnFilterValue {
    return isReferenceColumn(filterValue.column);
}
export function isChoiceColumnFilterValue(filterValue: ColumnFilterValue): filterValue is ChoiceTypeColumnFilterValue {
    return isChoiceColumn(filterValue.column);
}
export function isSolidChoiceColumnFilterValue(
    filterValue: ColumnFilterValue,
): filterValue is SolidChoiceTypeColumnFilterValue {
    return isSolidChoiceColumn(filterValue.column);
}

export interface SearchBarData {
    columnsFilterValues: ColumnFilterValue[];
    onChangeColumnFilter: (value: ColumnFilterValue['value'], key: string) => void;
    onResetFilters: () => void;
}
