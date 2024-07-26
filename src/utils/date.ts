import { differenceInDays, differenceInMonths, differenceInYears, format, parseISO } from 'date-fns';
import { Period } from 'fhir/r4b';
import _ from 'lodash';

import { parseFHIRDate, parseFHIRDateTime } from '@beda.software/fhir-react';

export const humanDate = 'dd/MM/yyyy';
export const humanDateYearMonth = 'MMM YYYY';
export const humanTime = 'HH:mm';
export const humanDateTime = 'dd/MM/yyyy HH:mm';

const TIME_FORMAT = 'hh:mm';

const formatFHIRDate = (date: string, formatType: string) => {
    try {
        return format(parseISO(date), formatType);
    } catch {
        console.error(`Invalid date format: ${date}`);
        return String(date);
    }
};

export const formatHumanDateTime = (date?: string) => {
    if (!date) {
        return '';
    }

    return parseFHIRDateTime(date).format(humanDateTime);
};

export const formatHumanTime = (date: string) => {
    return formatFHIRDate(date, TIME_FORMAT);
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

    if (date.length === 10) {
        return parseFHIRDate(date).format(humanDate);
    }

    return parseFHIRDateTime(date).format(humanDate);
};

export function getYears(date: string) {
    return differenceInYears(new Date(), parseISO(date));
}

export function getMonths(date: string) {
    return differenceInMonths(new Date(), parseISO(date));
}

export function getDays(date: string) {
    return differenceInDays(new Date(), parseISO(date));
}

export function getPersonAge(date: string) {
    if (getYears(date) > 0) {
        return `${getYears(date)} y.o.`;
    }

    if (getMonths(date) > 0) {
        return `${getMonths(date)} m.o.`;
    }

    return `${getDays(date)} d.o.`;
}

export function formatPeriodDateTime(period?: Period) {
    const timeRange = _.compact([
        period?.start ? parseFHIRDateTime(period.start).format('HH:mm') : undefined,
        period?.end ? parseFHIRDateTime(period.end).format('HH:mm') : undefined,
    ]).join('–');

    return period?.start ? `${formatHumanDate(period.start)} ${timeRange}` : null;
}
