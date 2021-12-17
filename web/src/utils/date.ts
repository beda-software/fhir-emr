import { format, parseISO } from 'date-fns';

const DATE_TIME_FORMAT = 'dd.MM.yyyy HH:mm';
const DATE_FORMAT = 'dd.MM.yyyy';
const TIME_FORMAT = 'hh:mm';

const formatFHIRDate = (date: string, formatType: string) => {
    try {
        return format(parseISO(date), formatType);
    } catch {
        console.error(`Invalid date format: ${date}`);
        return String(date);
    }
};

export const formatHumanDateTime = (date: string) => {
    return formatFHIRDate(date, DATE_TIME_FORMAT);
};

export const formatHumanTime = (date: string) => {
    return formatFHIRDate(date, TIME_FORMAT);
};

export const formatHumanDate = (date: string) => {
    return formatFHIRDate(date, DATE_FORMAT);
};
