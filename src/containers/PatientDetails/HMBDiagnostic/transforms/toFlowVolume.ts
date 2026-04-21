import { t } from '@lingui/macro';

import { categoricalAxis, last12, toChartMeta } from './utils';
import { HMBChartDatum, HMBResponseRow } from '../types';

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
    const recent = last12(rows);

    return toChartMeta(recent).map((meta, index) => ({
        ...meta,
        y: axis.toIndex(recent[index]?.flow),
    }));
}
