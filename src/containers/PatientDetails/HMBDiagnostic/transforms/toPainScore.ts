import { t } from '@lingui/macro';

import { categoricalAxis, last12, toChartMeta } from './utils';
import { HMBChartDatum, HMBResponseRow } from '../types';

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
    const recent = last12(rows);

    return toChartMeta(recent).map((meta, index) => ({
        ...meta,
        y: axis.toIndex(recent[index]?.pain_severity),
        yLine: recent[index]?.pain_score ?? undefined,
    }));
}
