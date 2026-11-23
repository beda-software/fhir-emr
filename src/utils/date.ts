import { Period } from 'fhir/r4b';
import _ from 'lodash';

import config from '@beda.software/emr-config';
import { parseFHIRDate, parseFHIRDateTime, parseFHIRTime } from '@beda.software/fhir-react';

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

    return parseDisplayDateTime(date).format(humanDateTime);
};
export const formatHumanTime = (date?: string) => {
    if (!date) {
        return '';
    }

    return (date.includes('T') ? parseDisplayDateTime(date) : parseFHIRTime(date)).format(humanTime);
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

    return parseDisplayDateTime(date).format(humanDate);
};

export function formatPeriodDateTime(period?: Period) {
    const timeRange = _.compact([
        period?.start ? parseDisplayDateTime(period.start).format(humanTime) : undefined,
        period?.end ? parseDisplayDateTime(period.end).format(humanTime) : undefined,
    ]).join('–');

    return period?.start ? `${formatHumanDate(period.start)} ${timeRange}` : null;
}

// Intl supplies the IANA-zone offset at this instant, including daylight saving. Keep Moment's
// locale and configurable format strings. Date-only values carry no instant to convert.
function parseDisplayDateTime(date: string) {
    const value = parseFHIRDateTime(date);
    if (!config.displayTimeZone || !date.includes('T') || !value.isValid()) {
        return value;
    }

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: config.displayTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(value.toDate());
    const part = (name: Intl.DateTimeFormatPartTypes) => Number(parts.find(({ type }) => type === name)?.value);
    const wallTime = Date.UTC(
        part('year'),
        part('month') - 1,
        part('day'),
        part('hour'),
        part('minute'),
        part('second'),
    );
    const offset = (wallTime - (value.valueOf() - value.millisecond())) / 60000;
    return value.utcOffset(offset);
}
