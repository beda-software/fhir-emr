import {
    ColumnFilterValue,
    DateColumnFilterValue,
    DateTypeColumnFilterValue,
    ReferenceColumnFilterValue,
    ReferenceTypeColumnFilterValue,
    StringTypeColumnFilterValue,
} from '../types';

export type SearchBarColumnProps<T> = {
    columnFilterValue: ColumnFilterValue;
    onChange: (value: DateColumnFilterValue | ReferenceColumnFilterValue | string, key: string) => void;
};

export interface SearchBarColumnStringTypeProps {
    columnFilterValue: StringTypeColumnFilterValue;
    onChange: (value: string, key: string) => void;
}

export interface SearchBarColumnDateTypeProps {
    columnFilterValue: DateTypeColumnFilterValue;
    onChange: (value: DateColumnFilterValue, key: string) => void;
}

export interface SearchBarColumnReferenceTypeProps {
    columnFilterValue: ReferenceTypeColumnFilterValue;
    onChange: (value: ReferenceColumnFilterValue, key: string) => void;
}
