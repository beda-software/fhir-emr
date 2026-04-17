import { ChartDatumBase } from 'src/components/Chart';

export interface HMBResponseRow {
    id: string;
    patient_id: string;
    authored: string;
    flow: 'very-heavy' | 'heavy' | 'moderate' | 'light' | 'very-light' | null;
    pain_severity: 'very-severe' | 'severe' | 'moderate' | 'mild' | 'no-pain' | null;
    pain_score: number | null;
    impact_score: number | null;
    intensity: number | null;
}

export interface HMBChartDatum extends ChartDatumBase {
    xLabel: string;
    xDate: string;
    qrId: string;
    rawValue?: string;
}
