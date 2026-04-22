/* eslint-disable react-refresh/only-export-components */
import { AreaChartOutlined, BarChartOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import type { ReactNode } from 'react';
import type { ValueType, Payload } from 'recharts/types/component/DefaultTooltipContent';

import { ChartCardProps } from 'src/components/Chart';

import { HMBChartDatum, HMBResponseRow } from './types';

const HMB_X_VALUE_SEPARATOR = '__hmb_qr__';

export function formatAuthoredDate(iso: string): string {
    return new Intl.DateTimeFormat(i18n.locale || undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso));
}

export function formatAuthoredTime(iso: string): string {
    return new Intl.DateTimeFormat(i18n.locale || undefined, {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
}

function isToday(iso: string): boolean {
    const d = new Date(iso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function getChartDisplayLabel(value: string | number): string {
    return String(value).split(HMB_X_VALUE_SEPARATOR)[0] ?? String(value);
}

export function toChartMeta(rows: HMBResponseRow[]): Array<Pick<HMBChartDatum, 'x' | 'xLabel' | 'xDate' | 'qrId'>> {
    return rows.map((row) => {
        const xLabel = isToday(row.authored) ? formatAuthoredTime(row.authored) : formatAuthoredDate(row.authored);

        return {
            x: `${xLabel}${HMB_X_VALUE_SEPARATOR}${row.id}`,
            xLabel,
            xDate: row.authored,
            qrId: row.id,
        };
    });
}

export function toNumericField(field: 'impact_score' | 'intensity') {
    return (rows: HMBResponseRow[]): HMBChartDatum[] => {
        return toChartMeta(rows).map((meta, index) => ({
            ...meta,
            y: rows[index]?.[field] ?? NaN,
        }));
    };
}

export interface OrderedCategory<Key extends string> {
    key: Key;
    label: string;
}

export interface CategoricalAxis<Key extends string> {
    toIndex: (key: Key | null | undefined) => number;
    labelAt: (index: number) => string;
    chartProps: {
        yDomain: [number, number];
        yTicks: number[];
        yTickFormatter: (index: number) => string;
    };
}

export function categoricalAxis<Key extends string>(categories: readonly OrderedCategory<Key>[]): CategoricalAxis<Key> {
    const byKey = new Map(categories.map((c, i) => [c.key, i] as const));
    const labels = categories.map((c) => c.label);
    const ticks = categories.map((_, i) => i);
    const labelAt = (index: number) => labels[index] ?? '';

    return {
        toIndex: (key) => (key != null && byKey.has(key) ? byKey.get(key)! : NaN),
        labelAt,
        chartProps: {
            yDomain: [0, categories.length - 1],
            yTicks: ticks,
            yTickFormatter: labelAt,
        },
    };
}

export const flowAxis = () =>
    categoricalAxis([
        { key: 'very-light', label: t`Very Light` },
        { key: 'light', label: t`Light` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'heavy', label: t`Heavy` },
        { key: 'very-heavy', label: t`Very Heavy` },
    ] as const);

export function toFlowVolume(rows: HMBResponseRow[]): HMBChartDatum[] {
    const axis = flowAxis();

    return toChartMeta(rows).map((meta, index) => ({
        ...meta,
        y: axis.toIndex(rows[index]?.flow),
    }));
}

export const severityAxis = () =>
    categoricalAxis([
        { key: 'no-pain', label: t`No Pain` },
        { key: 'mild', label: t`Mild` },
        { key: 'moderate', label: t`Moderate` },
        { key: 'severe', label: t`Severe` },
        { key: 'very-severe', label: t`Very Severe` },
    ] as const);

export function toPainScore(rows: HMBResponseRow[]): HMBChartDatum[] {
    const axis = severityAxis();

    return toChartMeta(rows).map((meta, index) => ({
        ...meta,
        y: axis.toIndex(rows[index]?.pain_severity),
        yLine: rows[index]?.pain_score ?? undefined,
    }));
}

type HMBChartConfig = Omit<ChartCardProps<HMBResponseRow, HMBChartDatum>, 'rows' | 'onPointClick'>;

const NUMERIC_DOMAIN: [number, number] = [0, 10];
const NUMERIC_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const labelFormatter = (label: ReactNode) =>
    typeof label === 'string' || typeof label === 'number' ? getChartDisplayLabel(label) : label;

const numericFormatter = (value: ValueType | undefined) =>
    typeof value === 'number' ? value.toFixed(1) : String(value ?? '');

export const getHMBCharts = (): HMBChartConfig[] => {
    const flow = flowAxis();
    const severity = severityAxis();

    const xAxisProps = { tickFormatter: getChartDisplayLabel, interval: 0 as const };

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
                labelFormatter,
                formatter: (value: ValueType | undefined) =>
                    typeof value === 'number' ? flow.labelAt(value) : String(value ?? ''),
            },
            yAxisProps: { width: 90 },
        },
        {
            xAxisProps,
            ...severity.chartProps,
            title: t`Period Pain Score`,
            icon: <HeartOutlined />,
            variant: 'bar+line',
            transform: toPainScore,
            yLineDomain: [1, 10],
            yLineTicks: NUMERIC_TICKS,
            barProps: { name: 'Pain Presence' },
            lineProps: {
                name: 'Pain Score',
            },
            tooltipProps: {
                labelFormatter,
                formatter: (value: ValueType | undefined, _name, item: Payload<ValueType, string | number>) =>
                    item.dataKey === 'y' && typeof value === 'number' ? severity.labelAt(value) : String(value ?? ''),
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
            tooltipProps: { labelFormatter, formatter: numericFormatter },
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
            tooltipProps: { labelFormatter, formatter: numericFormatter },
        },
    ];
};
