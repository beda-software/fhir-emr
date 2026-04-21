import { i18n } from '@lingui/core';

import { HMBChartDatum, HMBResponseRow } from '../types';

const HMB_X_VALUE_SEPARATOR = '__hmb_qr__';

export function last12<T>(arr: T[]): T[] {
    return arr.slice(-12);
}

export function formatAuthoredDate(iso: string): string {
    return new Intl.DateTimeFormat(i18n.locale || undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso));
}

export function formatAuthoredDateTime(iso: string): string {
    return new Intl.DateTimeFormat(i18n.locale || undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
}

export function getChartDisplayLabel(value: string | number): string {
    return String(value).split(HMB_X_VALUE_SEPARATOR)[0] ?? String(value);
}

export function toChartMeta(rows: HMBResponseRow[]): Array<Pick<HMBChartDatum, 'x' | 'xLabel' | 'xDate' | 'qrId'>> {
    const responsesByDay = rows.reduce<Map<string, number>>((acc, row) => {
        const dayKey = formatAuthoredDate(row.authored);
        acc.set(dayKey, (acc.get(dayKey) ?? 0) + 1);
        return acc;
    }, new Map());

    return rows.map((row) => {
        const hasSameDayResponses = (responsesByDay.get(formatAuthoredDate(row.authored)) ?? 0) > 1;
        const xLabel = hasSameDayResponses ? formatAuthoredDateTime(row.authored) : formatAuthoredDate(row.authored);

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
        const recentRows = last12(rows);

        return toChartMeta(recentRows).map((meta, index) => ({
            ...meta,
            y: recentRows[index]?.[field] ?? NaN,
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
            yDomain: [-0.5, categories.length - 0.5],
            yTicks: ticks,
            yTickFormatter: labelAt,
        },
    };
}
