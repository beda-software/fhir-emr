import {
    ColumnFilterValue,
    DateColumnFilterValue,
    DateTypeColumnFilterValue,
    StringTypeColumnFilterValue,
} from '../types';

export type SearchBarColumnProps<T> = {
    columnFilterValue: ColumnFilterValue<T>;
    onChange: (value: DateColumnFilterValue | string, key: string) => void;
};

export interface SearchBarColumnStringTypeProps<T> {
    columnFilterValue: StringTypeColumnFilterValue<T>;
    onChange: (value: string, key: string) => void;
}

export interface SearchBarColumnDateTypeProps<T> {
    columnFilterValue: DateTypeColumnFilterValue<T>;
    onChange: (value: DateColumnFilterValue, key: string) => void;
}
