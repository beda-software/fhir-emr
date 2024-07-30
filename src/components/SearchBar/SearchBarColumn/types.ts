import {
    ColumnFilterValue,
    DateColumnFilterValue,
    DateTypeColumnFilterValue,
    ReferenceTypeColumnFilterValue,
    StringTypeColumnFilterValue,
} from 'src/components/SearchBar/types';

export type SearchBarColumnProps = {
    columnFilterValue: ColumnFilterValue;
    onChange: (value: ColumnFilterValue['value'], key: string) => void;
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
    onChange: (value: ReferenceTypeColumnFilterValue['value'], key: string) => void;
}
