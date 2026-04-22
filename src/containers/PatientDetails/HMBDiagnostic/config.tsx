import { AreaChartOutlined, BarChartOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';

import { createCategoricalAxis, formatAuthored, makeUniqueX } from 'src/components/Chart';
import type { CategoricalAxis, ChartCardProps } from 'src/components/Chart';

import { HMBChartDatum, HMBResponseRow } from './types';

type HMBChartMeta = Pick<HMBChartDatum, 'x' | 'xLabel' | 'xDate' | 'qrId'>;
type HMBChartConfig = Omit<ChartCardProps<HMBResponseRow, HMBChartDatum>, 'rows' | 'onPointClick'>;
type AreaScoreField = 'impact_score' | 'intensity';
type FlowAxis = CategoricalAxis<NonNullable<HMBResponseRow['flow']>>;
type SeverityAxis = CategoricalAxis<NonNullable<HMBResponseRow['pain_severity']>>;

const SCORE_DOMAIN: [number, number] = [0, 10];
const PAIN_SCORE_DOMAIN: [number, number] = [1, 10];
const SCORE_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const X_AXIS_PROPS = { interval: 0 as const };

function toChartMetaRow(row: HMBResponseRow): HMBChartMeta {
    const xLabel = formatAuthored(row.authored);

    return {
        x: makeUniqueX(xLabel, row.id),
        xLabel,
        xDate: row.authored,
        qrId: row.id,
    };
}

// Reuse the same x-axis metadata across all HMB charts so a clicked point can open the source document.
export function toChartMeta(rows: HMBResponseRow[]): HMBChartMeta[] {
    return rows.map(toChartMetaRow);
}

// Numeric questionnaire answers can be absent; undefined lets Recharts skip the point instead of rendering NaN.
export function toNumericField(field: AreaScoreField) {
    return (rows: HMBResponseRow[]): HMBChartDatum[] =>
        rows.map((row) => ({
            ...toChartMetaRow(row),
            y: row[field] ?? undefined,
        }));
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
const toFlowVolumeWithAxis =
    (axis: FlowAxis) =>
    (rows: HMBResponseRow[]): HMBChartDatum[] =>
        rows.map((row) => ({
            ...toChartMetaRow(row),
            y: axis.encode(row.flow),
        }));

export const toFlowVolume = (rows: HMBResponseRow[]): HMBChartDatum[] => toFlowVolumeWithAxis(flowAxis())(rows);

export const severityAxis = () =>
    createCategoricalAxis([
        { key: 'no-pain', label: t`No Pain` },
        { key: 'mild', label: t`Mild` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'severe', label: t`Severe` },
        { key: 'very-severe', label: t`Very Severe` },
    ] as const);

// The bar shows ordered pain severity; the right-axis line keeps the numeric pain score.
const toPainScoreWithAxis =
    (axis: SeverityAxis) =>
    (rows: HMBResponseRow[]): HMBChartDatum[] =>
        rows.map((row) => ({
            ...toChartMetaRow(row),
            y: axis.encode(row.pain_severity),
            yLine: row.pain_score ?? undefined,
        }));

export const toPainScore = (rows: HMBResponseRow[]): HMBChartDatum[] => toPainScoreWithAxis(severityAxis())(rows);

// Recharts tooltip formatters receive mixed values, so only numbers get fixed precision.
const numericFormatter = (value: unknown) => (typeof value === 'number' ? value.toFixed(1) : String(value ?? ''));

export const getHMBCharts = (): HMBChartConfig[] => {
    const flow = flowAxis();
    const severity = severityAxis();

    return [
        {
            xAxisProps: X_AXIS_PROPS,
            title: t`Flow Volume`,
            icon: <BarChartOutlined />,
            variant: 'bar',

            ...flow.chartProps,
            transform: toFlowVolumeWithAxis(flow),

            barProps: { name: t`Flow Volume` },
            tooltipProps: {
                formatter: flow.tooltipFormatter,
            },
            yAxisProps: { width: 90 },
        },
        {
            xAxisProps: X_AXIS_PROPS,
            title: t`Period Pain Score`,
            icon: <HeartOutlined />,
            variant: 'bar+line',

            ...severity.chartProps,
            transform: toPainScoreWithAxis(severity),

            yLineDomain: PAIN_SCORE_DOMAIN,
            yLineTicks: SCORE_TICKS,
            barProps: { name: t`Pain Severity` },
            lineProps: {
                name: t`Pain Score`,
            },
            tooltipProps: {
                formatter: severity.tooltipFormatterForDataKey('y'),
            },
            yAxisProps: { width: 100 },
        },
        {
            xAxisProps: X_AXIS_PROPS,
            title: t`Impact of Period on Daily Activities`,
            icon: <CalendarOutlined />,
            variant: 'area',
            transform: toNumericField('impact_score'),
            yDomain: SCORE_DOMAIN,
            yTicks: SCORE_TICKS,
            areaProps: { name: t`Impact Score` },
            tooltipProps: { formatter: numericFormatter },
        },
        {
            xAxisProps: X_AXIS_PROPS,
            title: t`Intensity of Menstrual Bleeding`,
            icon: <AreaChartOutlined />,
            variant: 'area',
            transform: toNumericField('intensity'),
            yDomain: SCORE_DOMAIN,
            yTicks: SCORE_TICKS,
            areaProps: { name: t`Intensity` },
            tooltipProps: { formatter: numericFormatter },
        },
    ];
};
