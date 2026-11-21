import { afterEach, describe, expect, it, vi } from 'vitest';

import config from '@beda.software/emr-config';

import { formatHumanDate, formatHumanDateTime, formatHumanTime, formatPeriodDateTime } from './date';

vi.mock('@beda.software/emr-config', () => ({ default: {} }));

afterEach(() => {
    config.displayTimeZone = undefined;
});

describe('deployment display time zone', () => {
    it('uses Sydney across timestamp formatters, including daylight saving', () => {
        config.displayTimeZone = 'Australia/Sydney';
        expect(formatHumanDateTime('2026-11-02T03:30:05Z')).toBe('02 Nov 2026 14:30');
        expect(formatHumanDateTime('2026-07-02T03:30:05Z')).toBe('02 Jul 2026 13:30');
        expect(formatHumanDate('2026-11-02T14:30:05Z')).toBe('03 Nov 2026');
        expect(formatHumanTime('2026-11-02T03:30:05Z')).toBe('14:30');
        expect(formatPeriodDateTime({ start: '2026-11-02T03:30:05Z', end: '2026-11-02T04:00:00Z' })).toBe(
            '02 Nov 2026 14:30–15:00',
        );
    });

    it('preserves date-only and time-only values', () => {
        config.displayTimeZone = 'Australia/Sydney';
        expect(formatHumanDate('1980-04-12')).toBe('12 Apr 1980');
        expect(formatHumanDate('1980-04')).toBe('Apr 1980');
        expect(formatHumanDate('1980')).toBe('1980');
        expect(formatHumanTime('14:30:00')).toBe('14:30');
    });

    it('keeps the browser-local default when no deployment zone is configured', () => {
        const timestamp = '2026-11-02T03:30:05Z';
        const local = new Date(timestamp);
        expect(formatHumanTime(timestamp)).toBe(
            `${String(local.getHours()).padStart(2, '0')}:${String(local.getMinutes()).padStart(2, '0')}`,
        );
    });
});
