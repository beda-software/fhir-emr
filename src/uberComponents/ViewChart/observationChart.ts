import { t } from '@lingui/macro';

import type { ChartDatumBase } from 'src/components/Chart';

import { buildReferenceChart, transformRows } from './referenceChart';
import type { ReferenceChartRow, ViewChartConfig } from './types';

// Rows of the generated Observation ViewDefinitions (resources/init-seeds/ViewDefinition/obs-*.yaml)
export interface ObservationChartRow extends ReferenceChartRow {
    unit: string | null;
    // Second series of panels, e.g. diastolic blood pressure
    value_quantity_line?: number | null;
}

function formatWithUnit(unit: string | null | undefined) {
    return (value: unknown) => {
        if (typeof value !== 'number') {
            return '';
        }

        return unit ? `${value} ${unit}` : String(value);
    };
}

export function buildNumericObservationChart<TRow extends ObservationChartRow>(
    rows: TRow[],
): ViewChartConfig<TRow, ChartDatumBase> {
    return buildReferenceChart(rows, { formatValue: formatWithUnit(rows[0]?.unit) });
}

// Systolic is drawn as bars (value_quantity) and diastolic as a line (value_quantity_line) on the same scale
export function buildBloodPressureChart<TRow extends ObservationChartRow>(
    rows: TRow[],
): ViewChartConfig<TRow, ChartDatumBase> {
    const values = rows
        .flatMap((row) => [row.value_quantity, row.value_quantity_line])
        .filter((value): value is number => typeof value === 'number');
    const max = values.length ? Math.ceil(Math.max(...values) / 20) * 20 : undefined;
    const domain: [number, number] | undefined = max != undefined ? [0, max] : undefined;

    return {
        title: rows[0]?.title ?? t`Blood pressure`,
        variant: 'bar+line',
        transform: (chartRows) =>
            transformRows(chartRows).map((datum, index) => ({
                ...datum,
                yLine: chartRows[index]?.value_quantity_line ?? undefined,
            })),
        yDomain: domain,
        yLineDomain: domain,
        barProps: { name: t`Systolic` },
        lineProps: { name: t`Diastolic` },
        tooltipProps: { formatter: formatWithUnit(rows[0]?.unit) },
    };
}
