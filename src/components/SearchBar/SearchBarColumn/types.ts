import {
    ChoiceTypeColumnFilterValue,
    SolidChoiceTypeColumnFilterValue,
    ColumnFilterValue,
    DateTypeColumnFilterValue,
    ReferenceTypeColumnFilterValue,
    StringTypeColumnFilterValue,
    SingleDateTypeColumnFilterValue,
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

export interface SearchBarColumnSingleDateTypeProps {
    columnFilterValue: SingleDateTypeColumnFilterValue;
    onChange: (value: SingleDateTypeColumnFilterValue['value'], key: string) => void;
}

export interface SearchBarColumnReferenceTypeProps {
    columnFilterValue: ReferenceTypeColumnFilterValue;
    onChange: (value: ReferenceTypeColumnFilterValue['value'], key: string) => void;
}

export interface SearchBarColumnChoiceTypeProps {
    columnFilterValue: ChoiceTypeColumnFilterValue;
    onChange: (value: ChoiceTypeColumnFilterValue['value'], key: string) => void;
}

export interface SearchBarColumnSolidChoiceTypeProps {
    columnFilterValue: SolidChoiceTypeColumnFilterValue;
    onChange: (value: SolidChoiceTypeColumnFilterValue['value'], key: string) => void;
}
