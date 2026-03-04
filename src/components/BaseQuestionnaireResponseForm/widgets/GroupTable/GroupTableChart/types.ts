import type { AxisDomain } from 'recharts/types/util/types';

import { ChartHighlightArea, GroupTableRow } from '../types';

export interface GroupTableChartProps {
    dataSource: GroupTableRow[];
    linkIdX: string;
    linkIdY: string;
    chartYRange?: AxisDomain;
    chartHighlightAreas?: ChartHighlightArea[];
}
