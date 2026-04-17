import { t } from '@lingui/macro';

import { categoricalOrder, last12, OrderedCategory, toChartMeta } from './utils';
import { HMBChartDatum, HMBResponseRow } from '../types';

type FlowKey = 'very-light' | 'light' | 'moderate' | 'heavy' | 'very-heavy';

const flowCategories = (): readonly OrderedCategory<FlowKey>[] => [
    { key: 'very-light', label: t`Very Light` },
    { key: 'light', label: t`Light` },
    { key: 'moderate', label: t`Moderate` },
    { key: 'heavy', label: t`Heavy` },
    { key: 'very-heavy', label: t`Very Heavy` },
];

export const flowTicks = [0, 1, 2, 3, 4];

export function toFlowVolume(rows: HMBResponseRow[]): HMBChartDatum[] {
    const flow = categoricalOrder<FlowKey>(flowCategories());
    const recentRows = last12(rows);

    return toChartMeta(recentRows).map((meta, index) => ({
        ...meta,
        y: flow.toIndex(recentRows[index]?.flow),
        rawValue: recentRows[index]?.flow ?? undefined,
    }));
}

export const flowYTickFormatter = (n: number) => categoricalOrder<FlowKey>(flowCategories()).labelAt(n);

export const getFlowLabel = (value: number): string =>
    categoricalOrder<FlowKey>(flowCategories()).labelAt(value) || String(value);
