import { t } from '@lingui/macro';
import moment from 'moment';

export const humanDate = 'DD MMM YYYY';
export const humanDateYearMonth = 'MMM YYYY';
export const humanDateShort = 'DD/MM/YYYY';
export const humanTime = 'HH:mm';
export const humanDateTime = 'DD MMM YYYY HH:mm';

export const FHIRTime = 'HH:mm:ss';
export const FHIRDate = 'YYYY-MM-DD';
export const FHIRDateTime = 'YYYY-MM-DDTHH:mm:ss[Z]';

export const formatFHIRTime = (date: Date | moment.Moment) => moment(date).format(FHIRTime);
export const formatFHIRDate = (date: Date | moment.Moment) => moment(date).format(FHIRDate);
export const formatFHIRDateTime = (date: Date | moment.Moment) =>
    moment(date).utc().format(FHIRDateTime);

// parseFHIR* functions return moment instance in local timezone
export const parseFHIRTime = (date: string) => moment(date, FHIRTime);
export const parseFHIRDate = (date: string) => moment(date, FHIRDate);
export const parseFHIRDateTime = (date: string) => moment.utc(date, FHIRDateTime).local();

export const parseFHIRDateByMode = (date: string, mode: 'datetime' | 'date') => {
    if (mode === 'date') {
        return parseFHIRDateTime(date);
    }
    return parseFHIRDate(date);
};

export const formatHumanDateTime = (date?: string) => {
    if (!date) {
        return '';
    }

    return parseFHIRDateTime(date).format(humanDateTime);
};
export const formatHumanDate = (date?: string) => {
    if (!date) {
        return '';
    }

    // Year only 2000
    if (date.length === 4) {
        return date;
    }

    // Year and month 2000-01
    if (date.length === 7) {
        return parseFHIRDate(date + '-01').format(humanDateYearMonth);
    }

    if (date.length === FHIRDate.length) {
        return parseFHIRDate(date).format(humanDate);
    }

    return parseFHIRDateTime(date).format(humanDate);
};
export const formatHumanDateShort = (date?: string) => {
    if (!date) {
        return '';
    }

    if (date.length === FHIRDate.length) {
        return parseFHIRDate(date).format(humanDateShort);
    }

    return parseFHIRDateTime(date).format(humanDate);
};
export const formatHumanTime = (date?: string) => {
    if (!date) {
        return '';
    }

    if (date.length === FHIRTime.length) {
        return parseFHIRTime(date).format(humanTime);
    }

    return parseFHIRDateTime(date).format(humanTime);
};

export const calcAge = (date?: string) => {
    if (date) {
        const age = moment().diff(moment(date, 'YYYY-MM-DD'), 'years');
        return age + ' y.o.';
    }
    return null;
};

export const calcAgeAdvanced = (date: string) => {
    // TODO: the diff should be calculated regardless to hours (now - today date should return 0)
    const years = moment().diff(moment(date, 'YYYY-MM-DD'), 'years');
    const months = moment().diff(moment(date, 'YYYY-MM-DD'), 'months');
    const days = moment().diff(moment(date, 'YYYY-MM-DD'), 'days');

    return { years, months, days };
};

export const getFormattedAge = (date?: string) => {
    // Expected format:
    // 6 years
    // 4 years 8 months
    // 9 months
    // 3 months 26 days
    // 28 days
    if (date) {
        const { years, months, days } = calcAgeAdvanced(date);
        const yearString = years > 0 ? years + ' ' + t`yr` : false;
        const monthString = years < 5 && months && months - years * 12 + ' ' + t`mo`;
        const dayString = days <= 90 && days - months * 30 + ' ' + t`days`;
        return [yearString, monthString, dayString].filter(Boolean).join(' ');
    }
    return null;
};

export enum AgeCategory {
    Infant = 'Infant',
    Child = 'Child',
    NotChild = 'NotChild',
}

export const getAgeCategory = (date?: string): AgeCategory | null => {
    // Expected format:
    // up to 2 months
    // 2 months - 5 years
    // 5 years and older
    if (date) {
        const { years, months } = calcAgeAdvanced(date);
        if (years >= 5) {
            return AgeCategory.NotChild;
        } else if (months >= 2) {
            return AgeCategory.Child;
        } else {
            return AgeCategory.Infant;
        }
    }
    return null;
};

export const displayAgeCategory = (date?: string): string | null => {
    if (date) {
        const { years, months } = calcAgeAdvanced(date);
        if (years >= 5) {
            return t`NotChild`;
        } else if (months >= 2) {
            return t`Child`;
        } else {
            return t`Infant`;
        }
    }
    return null;
};

export const makeFHIRDateTime = (date: string, time = '00:00:00') =>
    formatFHIRDateTime(moment(`${date}T${time}`, `${FHIRDate}T${FHIRTime}`));
export const extractFHIRDate = (date: string) => {
    if (date.length === FHIRDate.length) {
        return date;
    }

    return formatFHIRDate(parseFHIRDateTime(date));
};
export const isFHIRDateEqual = (date1: string, date2: string) =>
    extractFHIRDate(date1) === extractFHIRDate(date2);

export const getFHIRCurrentDate = () => formatFHIRDate(moment());
export const getFHIRCurrentDateTime = () => formatFHIRDateTime(moment());
export const getFHIRCurrentDateTimeMin = () =>
    formatFHIRDateTime(moment().set({ hours: 0, minutes: 0, seconds: 0 }));
export const getFHIRCurrentDateTimeMax = () =>
    formatFHIRDateTime(moment().set({ hours: 23, minutes: 59, seconds: 59 }));

export function parseDateToMomentComponents(dateStr: string) {
    const components = dateStr.slice(0, 10).split('-');

    return {
        year: components.length >= 1 ? parseInt(components[0], 10) : undefined,
        // Month starts from 0 (Jan)
        month: components.length >= 2 ? parseInt(components[1], 10) - 1 : undefined,
        // Date starts from 1
        date: components.length >= 3 ? parseInt(components[2], 10) : undefined,
    };
}
