import {
    ColumnFilterValue,
    DateTypeColumnFilterValue,
    ReferenceTypeColumnFilterValue,
    StringTypeColumnFilterValue,
} from '../types';

export type SearchBarColumnProps = {
    columnFilterValue: ColumnFilterValue;
    onChange: (value: ColumnFilterValue['value'], key: string) => void;
};

export interface SearchBarColumnStringTypeProps {
    columnFilterValue: StringTypeColumnFilterValue;
    onChange: (value: StringTypeColumnFilterValue['value'], key: string) => void;
}

export interface SearchBarColumnDateTypeProps {
    columnFilterValue: DateTypeColumnFilterValue;
    onChange: (value: DateTypeColumnFilterValue['value'], key: string) => void;
}

export interface SearchBarColumnReferenceTypeProps {
    columnFilterValue: ReferenceTypeColumnFilterValue;
    onChange: (value: ReferenceTypeColumnFilterValue['value'], key: string) => void;
}
