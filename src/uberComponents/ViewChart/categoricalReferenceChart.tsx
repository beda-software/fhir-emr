import type { ChartDatumBase } from 'src/components/Chart';

import { BandTick } from './BandTick';
import type { ReferenceRange } from './referenceChart';
import { buildReferenceChart, parseReferenceRanges, transformRows } from './referenceChart';
import type { ReferenceChartRow, ViewChartConfig } from './types';

export interface CategoricalReferenceChartOptions {
    severityColors?: Record<string, string>;
    fallbackColor?: string;
    strokeDasharray?: string;
    formatBand?: (band: ReferenceRange) => string;
}

const DEFAULT_FALLBACK_COLOR = '#d9d9d9';
const MAX_AXIS_WIDTH = 240;

function defaultFormatBand(band: ReferenceRange): string {
    return band.text ?? '';
}

function bandIndex(bands: ReferenceRange[], value: number): number | undefined {
    const index = bands.findIndex((band) => value >= band.low && value <= band.high);
    return index === -1 ? undefined : index;
}

function estimateAxisWidth(labels: string[]): number {
    const longest = Math.max(0, ...labels.map((label) => label.length));
    return Math.min(MAX_AXIS_WIDTH, 24 + longest * 6);
}

export function buildCategoricalReferenceChart<TRow extends ReferenceChartRow>(
    rows: TRow[],
    options: CategoricalReferenceChartOptions = {},
): ViewChartConfig<TRow, ChartDatumBase> {
    const {
        severityColors = {},
        fallbackColor = DEFAULT_FALLBACK_COLOR,
        strokeDasharray = '4 4',
        formatBand = defaultFormatBand,
    } = options;

    const [first] = rows;
    const title = first?.title ?? '';
    const bands = [...parseReferenceRanges(first?.reference_range ?? null)].sort((a, b) => a.low - b.low);
    if (bands.length === 0) {
        return buildReferenceChart(rows);
    }

    const bandColor = (band: ReferenceRange) =>
        (band.severity != undefined ? severityColors[band.severity] : undefined) ?? fallbackColor;

    return {
        title,
        variant: 'area',
        transform: (chartRows) =>
            transformRows(chartRows).map((datum) => {
                const index = datum.y == null ? undefined : bandIndex(bands, datum.y);
                if (index == undefined) {
                    return { ...datum, y: undefined };
                }
                return { ...datum, y: index, dotColor: bandColor(bands[index]!) };
            }),
        yDomain: [-0.5, bands.length - 0.5],
        yTicks: bands.map((_, index) => index),
        yAxisProps: {
            width: estimateAxisWidth(bands.map(formatBand)),
            interval: 0,
            tick: <BandTick bands={bands} bandColor={bandColor} formatBand={formatBand} />,
        },
        areaProps: { name: title, type: 'step', strokeWidth: 1, strokeDasharray, fillOpacity: 0 },
        tooltipProps: {
            formatter: (value: unknown) => {
                const band = typeof value === 'number' ? bands[value] : undefined;
                return band ? formatBand(band) : '';
            },
        },
    };
}
