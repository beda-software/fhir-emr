export type OptionType = {
    value: string;
    label: string;
};

export type SingleValue<T> = T | null;
export type MultiValue<T> = readonly T[];

export type SelectOption = MultiValue<OptionType> | SingleValue<OptionType>;

export interface HealthcareServicePractitionerSelectProps {
    selectedHealthcareService: SelectOption;
    selectedPractitionerRole: SelectOption;
    loadHealthcareServiceOptions: (search: string) => void;
    loadPractitionerRoleOptions: (search: string) => void;
    onChangeHealthcareService: (option: SelectOption) => void;
    onChangePractitionerRole: (option: SelectOption) => void;
}

export interface AsyncDropdownProps {
    onChange: (selectedOption: OptionType | readonly OptionType[] | null) => void;
    loadOptions: (search: string) => void;
    value?: OptionType;
    placeholder?: string;
    hidden?: boolean;
}
