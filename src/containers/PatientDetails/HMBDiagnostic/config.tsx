import { AreaChartOutlined, BarChartOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';

import { createCategoricalAxis, formatAuthored, formatChartDateTime, makeUniqueX } from 'src/components/Chart';
import type { ChartCardProps } from 'src/components/Chart';

import type { HMBChartDatum, HMBResponseRow } from './types';

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;
type HMBChartConfig = DistributiveOmit<ChartCardProps<HMBResponseRow, HMBChartDatum>, 'rows' | 'onPointClick'> & {
    id: string;
};

function toChartPointMeta(row: HMBResponseRow) {
    const label = formatAuthored(row.authored);

    return {
        x: makeUniqueX(label, row.id),
        xTooltipLabel: formatChartDateTime(row.authored),
        qrId: row.id,
    };
}

// Recharts tooltip formatters receive mixed values, so only numbers get fixed precision.
const numericFormatter = (value: unknown) => (typeof value === 'number' ? value.toFixed(1) : String(value ?? ''));

export const getHMBCharts = (): HMBChartConfig[] => {
    const flow = createCategoricalAxis([
        { key: 'very-light', label: t`Very Light` },
        { key: 'light', label: t`Light` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'heavy', label: t`Heavy` },
        { key: 'very-heavy', label: t`Very Heavy` },
    ] as const);

    const severity = createCategoricalAxis([
        { key: 'no-pain', label: t`No Pain` },
        { key: 'mild', label: t`Mild` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'severe', label: t`Severe` },
        { key: 'very-severe', label: t`Very Severe` },
    ] as const);

    return [
        {
            id: 'flow-volume',
            xAxisProps: { interval: 0 },
            title: t`Flow Volume`,
            icon: <BarChartOutlined />,
            variant: 'bar',

            ...flow.chartProps,
            transform: (rows) =>
                rows.map((row) => ({
                    ...toChartPointMeta(row),
                    y: flow.encode(row.flow),
                })),

            barProps: { name: t`Flow Volume` },
            tooltipProps: {
                formatter: flow.tooltipFormatter,
            },
            yAxisProps: { width: 90 },
        },
        {
            id: 'period-pain-score',
            xAxisProps: { interval: 0 },
            title: t`Period Pain Score`,
            icon: <HeartOutlined />,
            variant: 'bar+line',

            ...severity.chartProps,
            transform: (rows) =>
                rows.map((row) => ({
                    ...toChartPointMeta(row),
                    y: severity.encode(row.pain_severity),
                    yLine: row.pain_score ?? undefined,
                })),

            yLineDomain: [1, 10],
            yLineTicks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
            id: 'period-impact-score',
            xAxisProps: { interval: 0 },
            title: t`Impact of Period on Daily Activities`,
            icon: <CalendarOutlined />,
            variant: 'area',
            transform: (rows) =>
                rows.map((row) => ({
                    ...toChartPointMeta(row),
                    y: row.impact_score ?? undefined,
                })),
            yDomain: [0, 10],
            yTicks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            areaProps: { name: t`Impact Score` },
            tooltipProps: { formatter: numericFormatter },
        },
        {
            id: 'bleeding-intensity',
            xAxisProps: { interval: 0 },
            title: t`Intensity of Menstrual Bleeding`,
            icon: <AreaChartOutlined />,
            variant: 'area',
            transform: (rows) =>
                rows.map((row) => ({
                    ...toChartPointMeta(row),
                    y: row.intensity ?? undefined,
                })),
            yDomain: [0, 10],
            yTicks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            areaProps: { name: t`Intensity` },
            tooltipProps: { formatter: numericFormatter },
        },
    ];
};
