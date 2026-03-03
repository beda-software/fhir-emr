import { ChartHighlightArea, GroupTableRow } from '../types';

export interface GroupTableChartProps {
    dataSource: GroupTableRow[];
    linkIdX: string;
    linkIdY: string;
    chartYRange?: number[];
    chartHighlightAreas?: ChartHighlightArea[];
}
