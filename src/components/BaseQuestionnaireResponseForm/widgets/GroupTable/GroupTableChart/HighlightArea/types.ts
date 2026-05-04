import type { ScaleFunction } from 'recharts/types/hooks';
import type { AxisId, YAxisPadding } from 'recharts/types/state/cartesianAxisSlice';
import type { PlotArea } from 'recharts/types/types';

import { ChartHighlightArea } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/types';

export interface HighlightProps {
    chartHighlight: ChartHighlightArea;
    yAxisId?: AxisId;
}

export interface HighlightParams {
    chartHighlight: ChartHighlightArea;
    plotArea?: PlotArea;
    yAxisPadding?: YAxisPadding;
    yScale?: ScaleFunction;
}
