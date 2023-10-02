export type OptionType = {
    value: string;
    label: string;
};

export type SingleValue<T> = T | null;
export type MultiValue<T> = readonly T[];
