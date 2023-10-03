import { MultiValue, OptionType, SingleValue } from './HealthcareServicePractitionerSelect/types';

const isSingleValue = (value: MultiValue<OptionType> | SingleValue<OptionType>): value is SingleValue<OptionType> => {
    return !Array.isArray(value);
};

export const getSelectedValue = (selectedValue: MultiValue<OptionType> | SingleValue<OptionType>): string => {
    if (!selectedValue) {
        return '';
    }

    if (isSingleValue(selectedValue)) {
        return selectedValue.value;
    }

    return selectedValue?.[0]?.value ?? '';
};
