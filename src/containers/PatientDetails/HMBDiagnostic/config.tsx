import { AreaChartOutlined, BarChartOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';

import { ChartCardProps, createCategoricalAxis, formatAuthored, makeUniqueX } from 'src/components/Chart';

import { HMBChartDatum, HMBResponseRow } from './types';

// Reuse the same x-axis metadata across all HMB charts so a clicked point can open the source document.
export function toChartMeta(rows: HMBResponseRow[]): Array<Pick<HMBChartDatum, 'x' | 'xLabel' | 'xDate' | 'qrId'>> {
    return rows.map((row) => {
        const xLabel = formatAuthored(row.authored);

        return {
            x: makeUniqueX(xLabel, row.id),
            xLabel,
            xDate: row.authored,
            qrId: row.id,
        };
    });
}

// Numeric questionnaire answers can be absent; undefined lets Recharts skip the point instead of rendering NaN.
export function toNumericField(field: 'impact_score' | 'intensity') {
    return (rows: HMBResponseRow[]): HMBChartDatum[] => {
        return toChartMeta(rows).map((meta, index) => ({
            ...meta,
            y: rows[index]?.[field] ?? undefined,
        }));
    };
}

export const flowAxis = () =>
    createCategoricalAxis([
        { key: 'very-light', label: t`Very Light` },
        { key: 'light', label: t`Light` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'heavy', label: t`Heavy` },
        { key: 'very-heavy', label: t`Very Heavy` },
    ] as const);

// Flow is stored as an ordered code, while the chart expects a numeric y value.
export function toFlowVolume(rows: HMBResponseRow[]): HMBChartDatum[] {
    const axis = flowAxis();

    return toChartMeta(rows).map((meta, index) => ({
        ...meta,
        y: axis.encode(rows[index]?.flow),
    }));
}

export const severityAxis = () =>
    createCategoricalAxis([
        { key: 'no-pain', label: t`No Pain` },
        { key: 'mild', label: t`Mild` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'severe', label: t`Severe` },
        { key: 'very-severe', label: t`Very Severe` },
    ] as const);

// The bar shows ordered pain severity; the right-axis line keeps the numeric pain score.
export function toPainScore(rows: HMBResponseRow[]): HMBChartDatum[] {
    const axis = severityAxis();

    return toChartMeta(rows).map((meta, index) => ({
        ...meta,
        y: axis.encode(rows[index]?.pain_severity),
        yLine: rows[index]?.pain_score ?? undefined,
    }));
}

type HMBChartConfig = Omit<ChartCardProps<HMBResponseRow, HMBChartDatum>, 'rows' | 'onPointClick'>;

const NUMERIC_DOMAIN: [number, number] = [0, 10];
const NUMERIC_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Recharts tooltip formatters receive mixed values, so only numbers get fixed precision.
const numericFormatter = (value: unknown) => (typeof value === 'number' ? value.toFixed(1) : String(value ?? ''));

export const getHMBCharts = (): HMBChartConfig[] => {
    const flow = flowAxis();
    const severity = severityAxis();

    const xAxisProps = { interval: 0 as const };

    return [
        {
            xAxisProps,
            title: t`Flow Volume`,
            icon: <BarChartOutlined />,
            variant: 'bar',

            ...flow.chartProps,
            transform: toFlowVolume,

            barProps: { name: 'Flow Volume' },
            tooltipProps: {
                formatter: flow.tooltipFormatter,
            },
            yAxisProps: { width: 90 },
        },
        {
            xAxisProps,
            title: t`Period Pain Score`,
            icon: <HeartOutlined />,
            variant: 'bar+line',

            ...severity.chartProps,
            transform: toPainScore,

            yLineDomain: [1, 10],
            yLineTicks: NUMERIC_TICKS,
            barProps: { name: 'Pain Presence' },
            lineProps: {
                name: 'Pain Score',
            },
            tooltipProps: {
                formatter: severity.tooltipFormatterForDataKey('y'),
            },
            yAxisProps: { width: 100 },
        },
        {
            xAxisProps,
            title: t`Impact of Period on Daily Activities`,
            icon: <CalendarOutlined />,
            variant: 'area',
            transform: toNumericField('impact_score'),
            yDomain: NUMERIC_DOMAIN,
            yTicks: NUMERIC_TICKS,
            areaProps: { name: 'Impact Score' },
            tooltipProps: { formatter: numericFormatter },
        },
        {
            xAxisProps,
            title: t`Intensity of Menstrual Bleeding`,
            icon: <AreaChartOutlined />,
            variant: 'area',
            transform: toNumericField('intensity'),
            yDomain: NUMERIC_DOMAIN,
            yTicks: NUMERIC_TICKS,
            areaProps: { name: 'Intensity' },
            tooltipProps: { formatter: numericFormatter },
        },
    ];
};
