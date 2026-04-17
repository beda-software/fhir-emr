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

function getAuthoredDayKey(iso: string): string {
    return formatAuthoredDate(iso);
}

export function toChartMeta(rows: HMBResponseRow[]): Array<Pick<HMBChartDatum, 'x' | 'xLabel' | 'xDate' | 'qrId'>> {
    const responsesByDay = rows.reduce<Map<string, number>>((acc, row) => {
        const dayKey = getAuthoredDayKey(row.authored);
        acc.set(dayKey, (acc.get(dayKey) ?? 0) + 1);
        return acc;
    }, new Map());

    return rows.map((row) => {
        const hasSameDayResponses = (responsesByDay.get(getAuthoredDayKey(row.authored)) ?? 0) > 1;
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

export function categoricalOrder<Key extends string>(categories: readonly OrderedCategory<Key>[]) {
    const byKey = new Map(categories.map((c, i) => [c.key, i]));
    const labels = categories.map((c) => c.label);

    return {
        toIndex: (key: Key | null | undefined): number => (key != null && byKey.has(key) ? byKey.get(key)! : NaN),
        labelAt: (index: number): string => labels[index] ?? '',
        ticks: categories.map((_, i) => i),
    };
}
