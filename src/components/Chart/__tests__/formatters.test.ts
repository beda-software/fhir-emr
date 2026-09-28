import { i18n } from '@lingui/core';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import {
    CHART_X_SEPARATOR,
    formatChartDateTime,
    getChartDisplayLabel,
    getDefaultChartTooltipLabel,
} from '../formatters';

describe('chart formatters', () => {
    beforeAll(() => {
        vi.spyOn(i18n, 'locale', 'get').mockReturnValue('en-GB');
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it('strips the unique x suffix from display labels', () => {
        expect(getChartDisplayLabel(`21 Nov 2025${CHART_X_SEPARATOR}response-1`)).toBe('21 Nov 2025');
    });

    it('formats chart date-time labels with both date and time', () => {
        const iso = '2025-11-21T09:05:00Z';
        const expected = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(iso));

        expect(formatChartDateTime(iso)).toBe(expected);
    });

    it('uses tooltip-specific labels when present', () => {
        expect(
            getDefaultChartTooltipLabel('21 Nov 2025', [
                {
                    payload: {
                        xTooltipLabel: '21 Nov 2025, 09:05',
                    },
                },
            ]),
        ).toBe('21 Nov 2025, 09:05');
    });

    it('falls back to the axis display label when tooltip-specific labels are absent', () => {
        expect(getDefaultChartTooltipLabel(`21 Nov 2025${CHART_X_SEPARATOR}response-1`, [])).toBe('21 Nov 2025');
    });
});
