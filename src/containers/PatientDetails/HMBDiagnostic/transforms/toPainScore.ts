import { t } from '@lingui/macro';

import { categoricalOrder, last12, OrderedCategory, toChartMeta } from './utils';
import { HMBChartDatum, HMBResponseRow } from '../types';

type SeverityKey = 'no-pain' | 'mild' | 'moderate' | 'severe' | 'very-severe';

const severityCategories = (): readonly OrderedCategory<SeverityKey>[] => [
    { key: 'no-pain', label: t`No Pain` },
    { key: 'mild', label: t`Mild` },
    { key: 'moderate', label: t`Moderate` },
    { key: 'severe', label: t`Severe` },
    { key: 'very-severe', label: t`Very Severe` },
];

export const severityTicks = [0, 1, 2, 3, 4];

export function toPainScore(rows: HMBResponseRow[]): HMBChartDatum[] {
    const severity = categoricalOrder<SeverityKey>(severityCategories());
    const recentRows = last12(rows);

    return toChartMeta(recentRows).map((meta, index) => ({
        ...meta,
        y: severity.toIndex(recentRows[index]?.pain_severity),
        yLine: recentRows[index]?.pain_score ?? undefined,
        rawValue: recentRows[index]?.pain_severity ?? undefined,
    }));
}

export const severityYTickFormatter = (n: number) => categoricalOrder<SeverityKey>(severityCategories()).labelAt(n);

export const getSeverityLabel = (value: number): string =>
    categoricalOrder<SeverityKey>(severityCategories()).labelAt(value) || String(value);
