import { i18n } from '@lingui/core';
import { beforeAll, describe, expect, it } from 'vitest';

import type { HMBResponseRow } from '../../types';
import { toFlowVolume } from '../toFlowVolume';
import { toImpact } from '../toImpact';
import { toPainScore } from '../toPainScore';
import { formatAuthoredDate, formatAuthoredDateTime, getChartDisplayLabel } from '../utils';

function makeRow(overrides: Partial<HMBResponseRow> = {}): HMBResponseRow {
    return {
        id: 'qr-1',
        patient_id: 'patient-1',
        authored: '2026-01-10T12:00:00.000Z',
        flow: 'moderate',
        pain_severity: 'mild',
        pain_score: 4,
        impact_score: 6,
        intensity: 5,
        ...overrides,
    };
}

describe('HMB transforms', () => {
    beforeAll(() => {
        i18n.activate('en');
    });

    it('uses a date-only label when a day has a single response', () => {
        const authored = '2026-01-10T12:00:00.000Z';
        const datum = toImpact([makeRow({ authored, impact_score: 8 })])[0];

        expect(datum).toBeDefined();
        if (!datum) {
            throw new Error('Expected chart datum');
        }

        expect(datum).toMatchObject({
            xLabel: formatAuthoredDate(authored),
            xDate: authored,
            qrId: 'qr-1',
            y: 8,
        });
        expect(getChartDisplayLabel(datum.x)).toBe(datum.xLabel);
        expect(datum.x).toContain('__hmb_qr__qr-1');
    });

    it('uses date-time labels and unique x values for same-day responses', () => {
        const firstAuthored = '2026-01-10T08:00:00.000Z';
        const secondAuthored = '2026-01-10T17:30:00.000Z';

        const data = toPainScore([
            makeRow({ id: 'qr-1', authored: firstAuthored, pain_severity: 'mild', pain_score: 3 }),
            makeRow({ id: 'qr-2', authored: secondAuthored, pain_severity: 'severe', pain_score: 8 }),
        ]);

        expect(data).toHaveLength(2);
        expect(data[0]?.xLabel).toBe(formatAuthoredDateTime(firstAuthored));
        expect(data[1]?.xLabel).toBe(formatAuthoredDateTime(secondAuthored));
        expect(data[0]?.x).not.toBe(data[1]?.x);
        expect(getChartDisplayLabel(data[0]!.x)).toBe(data[0]!.xLabel);
        expect(getChartDisplayLabel(data[1]!.x)).toBe(data[1]!.xLabel);
    });

    it('keeps only the last 12 responses in ascending order', () => {
        const rows = Array.from({ length: 13 }, (_, index) =>
            makeRow({
                id: `qr-${index + 1}`,
                authored: `2026-01-${String(index + 1).padStart(2, '0')}T12:00:00.000Z`,
                flow: 'light',
            }),
        );

        const data = toFlowVolume(rows);

        expect(data).toHaveLength(12);
        expect(data[0]?.qrId).toBe('qr-2');
        expect(data[11]?.qrId).toBe('qr-13');
    });

    it('maps null and unknown categorical values without crashing', () => {
        const flowData = toFlowVolume([
            makeRow({
                id: 'qr-null',
                flow: null,
            }),
            makeRow({
                id: 'qr-unknown',
                flow: 'unexpected' as HMBResponseRow['flow'],
            }),
        ]);

        const painData = toPainScore([
            makeRow({
                id: 'qr-pain-null',
                pain_severity: null,
                pain_score: null,
            }),
            makeRow({
                id: 'qr-pain-unknown',
                pain_severity: 'unexpected' as HMBResponseRow['pain_severity'],
                pain_score: 7,
            }),
        ]);

        expect(flowData.map((datum) => Number.isNaN(datum.y))).toEqual([true, true]);
        expect(painData.map((datum) => Number.isNaN(datum.y))).toEqual([true, true]);
        expect(painData[0]?.yLine).toBeUndefined();
        expect(painData[1]?.yLine).toBe(7);
    });
});
