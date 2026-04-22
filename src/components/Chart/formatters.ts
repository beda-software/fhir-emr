import { i18n } from '@lingui/core';
import type { ReactNode } from 'react';

// Internal delimiter used to keep duplicate x-axis labels unique while rendering only the visible label.
export const CHART_X_SEPARATOR = '\0';

export function formatChartDate(iso: string): string {
    return new Intl.DateTimeFormat(i18n.locale || undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso));
}

export function formatChartTime(iso: string): string {
    return new Intl.DateTimeFormat(i18n.locale || undefined, {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
}

export function formatChartDateTime(iso: string): string {
    return new Intl.DateTimeFormat(i18n.locale || undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
}

export function isToday(iso: string): boolean {
    const d = new Date(iso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function formatCompactChartDateTime(iso: string): string {
    return isToday(iso) ? formatChartTime(iso) : formatChartDate(iso);
}

export function makeUniqueX(label: string, id: string): string {
    return `${label}${CHART_X_SEPARATOR}${id}`;
}

export function getChartDisplayLabel(value: string | number): string {
    return String(value).split(CHART_X_SEPARATOR)[0] ?? String(value);
}

export function getDefaultChartTooltipLabel(
    label: ReactNode,
    payload?: ReadonlyArray<{ payload?: { xTooltipLabel?: string } }>,
): ReactNode {
    const tooltipLabel = payload?.[0]?.payload?.xTooltipLabel;

    if (tooltipLabel) {
        return tooltipLabel;
    }

    return typeof label === 'string' || typeof label === 'number' ? getChartDisplayLabel(label) : label;
}
