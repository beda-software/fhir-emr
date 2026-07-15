import { AreaChartOutlined, BarChartOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import type { Parameters } from 'fhir/r4b';
import type { ReactNode } from 'react';

import { createCategoricalAxis, formatAuthored, formatChartDateTime, makeUniqueX } from 'src/components/Chart';
import type { CategoricalAxis } from 'src/components/Chart';
import type { ReferenceChartRow, ViewChartConfig, ViewChartDataSource } from 'src/uberComponents/ViewChart';

import { HMBChartDatum } from './types';

type HMBQueryParameter = NonNullable<Parameters['parameter']>[number];
type HMBChartMeta = Pick<HMBChartDatum, 'x' | 'xLabel' | 'xDate' | 'xTooltipLabel' | 'qrId'>;
type FlowCode = 'very-heavy' | 'heavy' | 'moderate' | 'light' | 'very-light';
type SeverityCode = 'very-severe' | 'severe' | 'moderate' | 'mild' | 'no-pain';
type FlowAxis = CategoricalAxis<FlowCode>;
type SeverityAxis = CategoricalAxis<SeverityCode>;

export interface HMBChartEntry {
    id: string;
    source: ViewChartDataSource;
    icon: ReactNode;
    parameters: (patientId: string) => HMBQueryParameter[];
    config:
        | ViewChartConfig<ReferenceChartRow, HMBChartDatum>
        | ((rows: ReferenceChartRow[]) => ViewChartConfig<ReferenceChartRow, HMBChartDatum>);
}

const SCORE_DOMAIN: [number, number] = [0, 10];
const PAIN_SCORE_DOMAIN: [number, number] = [1, 10];
const SCORE_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const X_AXIS_PROPS = { interval: 0 as const };

// The four single-metric charts run against ViewDefinitions, filtered server-side by patient reference.
const viewDefinitionPatientParameters = (patientId: string): HMBQueryParameter[] => [
    { name: 'patient', valueReference: { reference: `Patient/${patientId}` } },
];

// The combined severity/score chart runs against an AidboxQuery, which reads the bare patient id.
const aidboxQueryPatientParameters = (patientId: string): HMBQueryParameter[] => [
    { name: 'patient', valueString: patientId },
];

function toChartMetaRow(row: ReferenceChartRow): HMBChartMeta {
    const xLabel = formatAuthored(row.axis_label);

    return {
        x: makeUniqueX(xLabel, row.id),
        xLabel,
        xDate: row.axis_label,
        xTooltipLabel: formatChartDateTime(row.axis_label),
        qrId: row.id,
    };
}

// Each single-metric HMB view definition carries its numeric answer in value_integer.
function toNumericValue(rows: ReferenceChartRow[]): HMBChartDatum[] {
    return rows.map((row) => ({
        ...toChartMetaRow(row),
        y: row.value_integer ?? undefined,
    }));
}

export const flowAxis = (): FlowAxis =>
    createCategoricalAxis([
        { key: 'very-light', label: t`Very Light` },
        { key: 'light', label: t`Light` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'heavy', label: t`Heavy` },
        { key: 'very-heavy', label: t`Very Heavy` },
    ] as const);

// Flow is stored as an ordered code in value_code, while the chart expects a numeric y value.
const toFlowVolumeWithAxis =
    (axis: FlowAxis) =>
    (rows: ReferenceChartRow[]): HMBChartDatum[] =>
        rows.map((row) => ({
            ...toChartMetaRow(row),
            y: axis.encode(row.value_code as FlowCode | null),
        }));

export const severityAxis = (): SeverityAxis =>
    createCategoricalAxis([
        { key: 'no-pain', label: t`No Pain` },
        { key: 'mild', label: t`Mild` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'severe', label: t`Severe` },
        { key: 'very-severe', label: t`Very Severe` },
    ] as const);

// The combined AidboxQuery carries severity as an ordered code in value_code (bar) and the raw
// pain score in value_integer (line).
const toPainSeverityAndScoreWithAxis =
    (axis: SeverityAxis) =>
    (rows: ReferenceChartRow[]): HMBChartDatum[] =>
        rows.map((row) => ({
            ...toChartMetaRow(row),
            y: axis.encode(row.value_code as SeverityCode | null),
            yLine: row.value_integer ?? undefined,
        }));

// Recharts tooltip formatters receive mixed values, so only numbers get fixed precision.
const numericFormatter = (value: unknown) => (typeof value === 'number' ? value.toFixed(1) : String(value ?? ''));

// chart is a function here so the right-axis (pain score) domain can stretch to fit any
// out-of-range scores instead of clipping them, while the left axis stays the fixed severity scale.
function buildPainSeverityAndScoreChart(rows: ReferenceChartRow[]): ViewChartConfig<ReferenceChartRow, HMBChartDatum> {
    const severity = severityAxis();
    const scores = rows.map((row) => row.value_integer).filter((score): score is number => score != null);
    const yLineMax = scores.length ? Math.max(PAIN_SCORE_DOMAIN[1], ...scores) : PAIN_SCORE_DOMAIN[1];

    return {
        xAxisProps: X_AXIS_PROPS,
        title: t`Period Pain Severity & Score`,
        variant: 'bar+line',

        ...severity.chartProps,
        transform: toPainSeverityAndScoreWithAxis(severity),

        yLineDomain: [PAIN_SCORE_DOMAIN[0], yLineMax],
        yLineTicks: SCORE_TICKS,
        barProps: { name: t`Pain Severity` },
        // No stroke override: bar+line charts default their line to theme.success (green).
        lineProps: { name: t`Pain Score` },
        tooltipProps: {
            formatter: severity.tooltipFormatterForDataKey('y'),
        },
        yAxisProps: { width: 100 },
    };
}

export const getHMBCharts = (): HMBChartEntry[] => {
    const flow = flowAxis();

    return [
        {
            id: 'flow-volume',
            source: { type: 'ViewDefinition', reference: 'ViewDefinition/hmb-flow-volume' },
            icon: <BarChartOutlined />,
            parameters: viewDefinitionPatientParameters,
            config: {
                xAxisProps: X_AXIS_PROPS,
                title: t`Flow Volume`,
                variant: 'bar',

                ...flow.chartProps,
                transform: toFlowVolumeWithAxis(flow),

                barProps: { name: t`Flow Volume` },
                tooltipProps: {
                    formatter: flow.tooltipFormatter,
                },
                yAxisProps: { width: 90 },
            },
        },
        {
            id: 'pain-severity-score',
            source: { type: 'AidboxQuery', reference: 'AidboxQuery/hmb-pain-severity-score' },
            icon: <HeartOutlined />,
            parameters: aidboxQueryPatientParameters,
            config: buildPainSeverityAndScoreChart,
        },
        {
            id: 'impact-score',
            source: { type: 'ViewDefinition', reference: 'ViewDefinition/hmb-impact-score' },
            icon: <CalendarOutlined />,
            parameters: viewDefinitionPatientParameters,
            config: {
                xAxisProps: X_AXIS_PROPS,
                title: t`Impact of Period on Daily Activities`,
                variant: 'area',
                transform: toNumericValue,
                yDomain: SCORE_DOMAIN,
                yTicks: SCORE_TICKS,
                areaProps: { name: t`Impact Score` },
                tooltipProps: { formatter: numericFormatter },
            },
        },
        {
            id: 'intensity',
            source: { type: 'ViewDefinition', reference: 'ViewDefinition/hmb-intensity' },
            icon: <AreaChartOutlined />,
            parameters: viewDefinitionPatientParameters,
            config: {
                xAxisProps: X_AXIS_PROPS,
                title: t`Intensity of Menstrual Bleeding`,
                variant: 'area',
                transform: toNumericValue,
                yDomain: SCORE_DOMAIN,
                yTicks: SCORE_TICKS,
                areaProps: { name: t`Intensity` },
                tooltipProps: { formatter: numericFormatter },
            },
        },
    ];
};
