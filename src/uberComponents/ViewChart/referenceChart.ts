import type { ObservationReferenceRange } from 'fhir/r4b';

import type { ChartDatumBase, ChartReferenceArea } from 'src/components/Chart';
import { formatAuthored, formatChartDateTime, makeUniqueX } from 'src/components/Chart';

import type { ReferenceChartOptions, ReferenceChartRow, ViewChartConfig } from './types';

const DEFAULT_REFERENCE_RANGE_COLORS: Record<string, string> = {
    HH: '#ff4d4f',
    HU: '#faad14',
};

function defaultFormatValue(value: unknown): string {
    return typeof value === 'number' ? String(value) : '';
}

function resultValue(row: ReferenceChartRow): number | undefined {
    if (row.value_code != null) {
        const numeric = Number(row.value_code);
        return Number.isNaN(numeric) ? undefined : numeric;
    }
    if (row.value_integer != null) {
        return row.value_integer;
    }
    if (row.value_quantity != null) {
        return row.value_quantity;
    }
    return undefined;
}

interface ReferenceRange {
    low: number;
    high: number;
    severity?: string;
}

function parseReferenceRanges(ranges: (ObservationReferenceRange | string)[] | null): ReferenceRange[] {
    return (ranges ?? [])
        .map((range: ObservationReferenceRange | string): ObservationReferenceRange | undefined => {
            if (typeof range !== 'string') {
                return range;
            }
            try {
                return JSON.parse(range) as ObservationReferenceRange;
            } catch {
                return undefined;
            }
        })
        .filter((range): range is ObservationReferenceRange => range?.low?.value != undefined)
        .map((range) => ({
            low: range.low!.value!,
            high: range.high?.value ?? range.low!.value!,
            severity: range.type?.coding?.[0]?.code,
        }));
}

function buildChartGrid(bands: ReferenceRange[]): number[] | undefined {
    if (bands.length === 0) {
        return undefined;
    }
    const values = new Set<number>([0, ...bands.map((band) => band.high)]);
    return [...values].sort((a, b) => a - b);
}

function buildChartReferenceAreas(
    bands: ReferenceRange[],
    referenceRangeColors: Record<string, string>,
    fillOpacity: number,
): ChartReferenceArea[] {
    const areas: ChartReferenceArea[] = [];
    let current: ChartReferenceArea | undefined;
    for (const band of [...bands].sort((a, b) => a.low - b.low)) {
        const fill = band.severity ? referenceRangeColors[band.severity] : undefined;
        if (fill && current?.fill === fill) {
            current.y2 = band.high;
        } else {
            if (current) {
                areas.push(current);
            }
            current = fill ? { y1: band.low, y2: band.high, fill, fillOpacity } : undefined;
        }
    }
    if (current) {
        areas.push(current);
    }
    return areas;
}

export function sortByAxisLabel(a: ReferenceChartRow, b: ReferenceChartRow): number {
    return a.axis_label.localeCompare(b.axis_label);
}

function transformRows<TRow extends ReferenceChartRow>(rows: TRow[]): ChartDatumBase[] {
    return rows.map((row) => ({
        x: makeUniqueX(formatAuthored(row.axis_label), row.id),
        xTooltipLabel: formatChartDateTime(row.axis_label),
        y: resultValue(row),
    }));
}

export function buildReferenceChart<TRow extends ReferenceChartRow>(
    rows: TRow[],
    options: ReferenceChartOptions = {},
): ViewChartConfig<TRow, ChartDatumBase> {
    const {
        severityFills = DEFAULT_REFERENCE_RANGE_COLORS,
        fillOpacity = 0.14,
        formatValue = defaultFormatValue,
    } = options;

    const [first] = rows;
    const title = first?.title ?? '';
    const bands = parseReferenceRanges(first?.reference_range ?? null);
    const max = bands.length ? Math.max(...bands.map((band) => band.high)) : undefined;

    return {
        title,
        variant: 'area',
        transform: transformRows,
        yDomain: max != undefined ? [0, max] : undefined,
        yTicks: buildChartGrid(bands),
        referenceAreas: bands.length ? buildChartReferenceAreas(bands, severityFills, fillOpacity) : undefined,
        areaProps: { name: title, fillOpacity: 0 },
        tooltipProps: { formatter: formatValue },
    };
}
