import type { ChartDatumBase } from 'src/components/Chart';

export interface QIMRow {
    denominator: number;
    numerator: number;
    [stratifier: string]: unknown;
}

export interface QIMChartDatum extends ChartDatumBase {
    denominator: number;
    numerator: number;
}
