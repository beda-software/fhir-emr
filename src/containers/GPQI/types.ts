import type { ChartDatumBase } from 'src/components/Chart';
import type { ReferenceChartRow } from 'src/uberComponents/ViewChart';

// The qim0X Library SQL queries only ever return sex/age_group/indigenous_status/[extra
// classification]/denominator/numerator columns — the ReferenceChartRow fields below are never
// actually populated. They're declared here only so QIMRow satisfies ViewChart's generic
// `TRow extends ReferenceChartRow` constraint; buildQIMChart never reads them.
export interface QIMRow extends ReferenceChartRow {
    denominator: number;
    numerator: number;
    [stratifier: string]: unknown;
}

export interface QIMChartDatum extends ChartDatumBase {
    denominator: number;
    numerator: number;
}
