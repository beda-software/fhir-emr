import { describe, expect, it } from 'vitest';

import { buildBloodPressureChart, buildNumericObservationChart } from '../observationChart';
import type { ObservationChartRow } from '../observationChart';

function row(id: string, systolic: number | null, diastolic?: number | null, unit = 'mm[Hg]'): ObservationChartRow {
    return {
        id,
        axis_label: `2025-01-0${id}T00:00:00`,
        title: 'Blood pressure panel',
        reference_range: [],
        value_code: null,
        value_integer: null,
        value_quantity: systolic,
        value_quantity_line: diastolic,
        unit,
    };
}

describe('buildBloodPressureChart', () => {
    const rows = [row('1', 128, 84), row('2', 141, 92), row('3', null, 80)];

    it('maps systolic to y and diastolic to yLine', () => {
        const data = buildBloodPressureChart(rows).transform(rows);

        expect(data.map((datum) => [datum.y, datum.yLine])).toEqual([
            [128, 84],
            [141, 92],
            [undefined, 80],
        ]);
    });

    it('uses one rounded domain for both axes', () => {
        const config = buildBloodPressureChart(rows);

        expect(config.variant).toBe('bar+line');
        expect(config.yDomain).toEqual([0, 160]);
        expect(config.yLineDomain).toEqual([0, 160]);
    });

    it('formats tooltip values with the unit', () => {
        const formatter = buildBloodPressureChart(rows).tooltipProps?.formatter as (value: unknown) => string;

        expect(formatter(128)).toBe('128 mm[Hg]');
    });
});

describe('buildNumericObservationChart', () => {
    it('formats tooltip values with the unit of the rows', () => {
        const rows = [row('1', 24.5, null, 'kg/m2')];
        const formatter = buildNumericObservationChart(rows).tooltipProps?.formatter as (value: unknown) => string;

        expect(formatter(24.5)).toBe('24.5 kg/m2');
        expect(formatter(undefined)).toBe('');
    });
});
