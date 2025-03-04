import { t } from '@lingui/macro';
import { differenceInDays, differenceInMonths, differenceInYears, parseISO } from 'date-fns';

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
        return `${getYears(date)} ${t`y.o.`}`;
    }

    if (getMonths(date) > 0) {
        return `${getMonths(date)} ${t`m.o.`}`;
    }

    return `${getDays(date)} ${t`d.o.`}`;
}
