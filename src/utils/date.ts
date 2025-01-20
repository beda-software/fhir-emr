import { Period } from 'fhir/r4b';
import _ from 'lodash';

import { parseFHIRDate, parseFHIRDateTime } from '@beda.software/fhir-react';

export let humanDate = 'DD MMM YYYY';
export let humanDateYearMonth = 'MMM YYYY';
export let humanTime = 'HH:mm';
export let humanDateTime = 'DD MMM YYYY HH:mm';

export type DateTimeFormat = {
    humanDate: string;
    humanDateYearMonth: string;
    humanTime: string;
    humanDateTime: string;
};

export const setDateTimeFormats = (formats: Partial<DateTimeFormat>) => {
    if (formats.humanDate) {
        humanDate = formats.humanDate;
    }
    if (formats.humanDateYearMonth) {
        humanDateYearMonth = formats.humanDateYearMonth;
    }
    if (formats.humanTime) {
        humanTime = formats.humanTime;
    }
    if (formats.humanDateTime) {
        humanDateTime = formats.humanDateTime;
    }
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

    if (date.length === 10) {
        return parseFHIRDate(date).format(humanDate);
    }

    return parseFHIRDateTime(date).format(humanDate);
};

export function formatPeriodDateTime(period?: Period) {
    const timeRange = _.compact([
        period?.start ? parseFHIRDateTime(period.start).format('HH:mm') : undefined,
        period?.end ? parseFHIRDateTime(period.end).format('HH:mm') : undefined,
    ]).join('–');

    return period?.start ? `${formatHumanDate(period.start)} ${timeRange}` : null;
}
