import {
    ColumnFilterValue,
    DateColumnFilterValue,
    DateTypeColumnFilterValue,
    StringTypeColumnFilterValue,
} from '../types';

export type SearchBarColumnProps<T> = {
    columnFilterValue: ColumnFilterValue;
    onChange: (value: DateColumnFilterValue | string, key: string) => void;
};

export interface SearchBarColumnStringTypeProps {
    columnFilterValue: StringTypeColumnFilterValue;
    onChange: (value: string, key: string) => void;
}

export interface SearchBarColumnDateTypeProps {
    columnFilterValue: DateTypeColumnFilterValue;
    onChange: (value: DateColumnFilterValue, key: string) => void;
}
