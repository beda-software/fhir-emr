import { ChartDatumBase } from 'src/components/Chart';

export interface HMBChartDatum extends ChartDatumBase {
    xLabel: string;
    xDate: string;
    qrId: string;
}
