export interface SearchBarProps {
    columns: SearchBarColumn[];
}
export type SearchBarStringColumn = {
    id: string;
    type: 'string';
    placeholder: string;
};
export type SearchBarDateColumn = {
    id: string;
    type: 'date';
    placeholder: [string, string];
};

export type SearchBarReferenceColumn = {
    id: string;
    type: 'select-service-practitioner';
    placeholder: string;
};

export type DateColumnFilterValue = [moment.Moment, moment.Moment];
export type ReferenceColumnFilterValue = { healthcareService?: string; practitionerRole?: string };

export type SearchBarColumn = SearchBarStringColumn | SearchBarDateColumn | SearchBarReferenceColumn;
export interface ColumnFilterValue {
    column: SearchBarColumn;
    value?: DateColumnFilterValue | ReferenceColumnFilterValue | string;
}
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
    value?: ReferenceColumnFilterValue;
}

export interface SearchBarData {
    columnsFilterValues: ColumnFilterValue[];
    onChangeColumnFilter: (value: DateColumnFilterValue | ReferenceColumnFilterValue | string, key: string) => void;
    onResetFilters: () => void;
}
