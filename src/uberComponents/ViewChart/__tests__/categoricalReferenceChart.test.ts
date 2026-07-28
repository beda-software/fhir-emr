import { describe, expect, it } from 'vitest';

import { buildCategoricalReferenceChart } from '../categoricalReferenceChart';
import type { ReferenceChartRow } from '../types';

function band(low: number, high: number, text: string, severity?: string): string {
    return JSON.stringify({
        low: { value: low },
        high: { value: high },
        text,
        ...(severity ? { type: { coding: [{ code: severity }] } } : {}),
    });
}

function row(id: string, value: number | null, referenceRange: string[] | null): ReferenceChartRow {
    return {
        id,
        axis_label: `2025-01-0${id}T00:00:00`,
        title: 'Score',
        reference_range: referenceRange,
        value_code: null,
        value_integer: value,
        value_quantity: null,
    };
}

const SEVERITY_COLORS = { N: '#d9d9d9', H: '#faad14', HH: '#ff4d4f' };

describe('buildCategoricalReferenceChart', () => {
    const bands = [band(0, 1, 'Normal', 'N'), band(2, 2, 'Elevated', 'H'), band(3, 3, 'Critical', 'HH')];
    const rows = [row('1', 0, bands), row('2', 1, bands), row('3', 2, bands), row('4', 3, bands)];

    it('encodes values as band indexes, sharing one row across a range band', () => {
        const config = buildCategoricalReferenceChart(rows, { severityColors: SEVERITY_COLORS });
        const data = config.transform(rows);

        expect(data.map((datum) => datum.y)).toEqual([
            0, // value 0 -> 'Normal' (0-1)
            0, // value 1 -> 'Normal' (0-1)
            1, // value 2 -> 'Elevated'
            2, // value 3 -> 'Critical'
        ]);
        expect(config.yTicks).toEqual([0, 1, 2]);
        expect(config.yDomain).toEqual([-0.5, 2.5]);
    });

    it('stamps dot colors from the band severity', () => {
        const config = buildCategoricalReferenceChart(rows, { severityColors: SEVERITY_COLORS });

        expect(config.transform(rows).map((datum) => datum.dotColor)).toEqual([
            '#d9d9d9',
            '#d9d9d9',
            '#faad14',
            '#ff4d4f',
        ]);
    });

    it('falls back to the fallback color for unmapped severities', () => {
        const uncodedBands = [band(0, 0, 'Normal'), band(2, 2, 'Critical', 'HH')];
        const uncodedRows = [row('1', 0, uncodedBands), row('2', 2, uncodedBands)];
        const config = buildCategoricalReferenceChart(uncodedRows, { severityColors: SEVERITY_COLORS });

        expect(config.transform(uncodedRows).map((datum) => datum.dotColor)).toEqual(['#d9d9d9', '#ff4d4f']);
    });

    it('drops points whose value falls in no band', () => {
        const gapBands = [band(0, 0, 'Normal', 'N'), band(2, 2, 'Critical', 'HH')];
        const gapRows = [row('1', 1, gapBands), row('2', 2, gapBands)];
        const config = buildCategoricalReferenceChart(gapRows, { severityColors: SEVERITY_COLORS });

        expect(config.transform(gapRows).map((datum) => datum.y)).toEqual([
            undefined, // value 1 falls between the 0 and 2 bands -> no point
            1, // value 2 -> 'Critical'
        ]);
    });

    it('formats tooltip values with the band formatter', () => {
        const config = buildCategoricalReferenceChart(rows, {
            severityColors: SEVERITY_COLORS,
            formatBand: (item) => `${item.text} (${item.low === item.high ? item.low : `${item.low}-${item.high}`})`,
        });
        const formatter = config.tooltipProps?.formatter as (value: unknown) => string;

        expect(formatter(0)).toBe('Normal (0-1)');
        expect(formatter(1)).toBe('Elevated (2)');
        expect(formatter(5)).toBe('');
    });

    it('formats band labels with the band text by default', () => {
        const config = buildCategoricalReferenceChart(rows, { severityColors: SEVERITY_COLORS });
        const formatter = config.tooltipProps?.formatter as (value: unknown) => string;

        expect(formatter(0)).toBe('Normal');
    });

    it('renders a dashed step line without zones', () => {
        const config = buildCategoricalReferenceChart(rows, { severityColors: SEVERITY_COLORS });

        expect(config.areaProps).toMatchObject({ type: 'step', strokeDasharray: '4 4', fillOpacity: 0 });
        expect(config.referenceAreas).toBeUndefined();
    });

    it('falls back to the reference chart for band-less rows', () => {
        const config = buildCategoricalReferenceChart([row('1', 2, null)]);

        expect(config.yTicks).toBeUndefined();
        expect(config.areaProps?.strokeDasharray).toBeUndefined();
        expect(config.transform([row('1', 2, null)]).map((datum) => datum.y)).toEqual([2]);
    });
});
