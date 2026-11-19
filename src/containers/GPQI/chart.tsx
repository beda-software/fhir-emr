import { t } from '@lingui/macro';

import type { ViewChartConfig } from 'src/uberComponents/ViewChart';

import { QIMChartDatum, QIMRow } from './types';

// qim0X Library queries always group by sex/age_group/indigenous_status plus, for some
// indicators, one extra classification column (diabetes_type, smoking_status, bmi, ...).
// The extra column (when present) is the most informative axis to chart by; otherwise fall
// back to whichever known stratifier actually varies across rows.
const KNOWN_STRATIFIERS = ['age_group', 'sex', 'indigenous_status'];
const NUMBER_KEYS = new Set(['denominator', 'numerator']);

// Never sort by ViewChart's default sortByAxisLabel (it assumes a `axis_label` field that
// QIM rows don't have) — rows are grouped/ordered inside the transform instead.
export const noSort = () => 0;

interface QIMGroup {
    label: string;
    denominator: number;
    numerator: number;
}

function findGroupKey(rows: QIMRow[]): string {
    if (rows.length === 0) {
        return 'age_group';
    }

    const keys = Object.keys(rows[0]!).filter((key) => !NUMBER_KEYS.has(key));
    const extraKeys = keys.filter((key) => !KNOWN_STRATIFIERS.includes(key));
    const candidates = [...extraKeys, ...KNOWN_STRATIFIERS].filter((key) => keys.includes(key));

    for (const key of candidates) {
        const distinctValues = new Set(rows.map((row) => String(row[key])));
        if (distinctValues.size > 1) {
            return key;
        }
    }

    return candidates[0] ?? 'age_group';
}

function groupRows(rows: QIMRow[], groupKey: string): QIMGroup[] {
    const groups = new Map<string, QIMGroup>();

    for (const row of rows) {
        const label = String(row[groupKey] ?? t`Unknown`);
        const group = groups.get(label) ?? { label, denominator: 0, numerator: 0 };
        group.denominator += row.denominator ?? 0;
        group.numerator += row.numerator ?? 0;
        groups.set(label, group);
    }

    return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label));
}

// Some qim Libraries measure compliance (numerator counts patients meeting a criterion out of
// a denominator population), others just classify an already-recorded value (numerator always
// equals denominator). Detect the latter and chart it as a share of the total instead of a
// (constant, uninformative) 100% compliance rate.
function isClassificationOnly(groups: QIMGroup[]): boolean {
    return groups.length > 0 && groups.every((group) => group.denominator === group.numerator);
}

function toPercent(value: number): number {
    return Math.round(value * 1000) / 10;
}

const percentTickFormatter = (value: number) => `${value}%`;

export function buildQIMChart(rows: QIMRow[]): ViewChartConfig<QIMRow, QIMChartDatum> {
    const groupKey = findGroupKey(rows);
    const groups = groupRows(rows, groupKey);
    const distribution = isClassificationOnly(groups);
    const totalNumerator = groups.reduce((sum, group) => sum + group.numerator, 0);

    const seriesName = distribution ? t`Share of patients` : t`Compliance rate`;

    return {
        variant: 'bar',
        yDomain: [0, 100],
        yTicks: [0, 20, 40, 60, 80, 100],
        yTickFormatter: percentTickFormatter,
        xAxisProps: { interval: 0 },
        barProps: { name: seriesName },
        tooltipProps: {
            formatter: (value, _name, entry) => {
                const datum = (entry as { payload?: QIMChartDatum }).payload;
                if (!datum) {
                    return `${value}%`;
                }
                return `${value}% (${datum.numerator}/${datum.denominator})`;
            },
        },
        // `rows` is the same array ViewChart just derived `groups` from, so it's safe to
        // reuse `groups` here rather than re-grouping the argument.
        transform: () =>
            groups.map((group) => ({
                x: group.label,
                y: distribution
                    ? totalNumerator > 0
                        ? toPercent(group.numerator / totalNumerator)
                        : 0
                    : group.denominator > 0
                    ? toPercent(group.numerator / group.denominator)
                    : 0,
                denominator: group.denominator,
                numerator: group.numerator,
            })),
    };
}
