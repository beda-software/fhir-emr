import type { XAxisMap, YAxisMap } from 'recharts/types/util/types';

import { ChartHighlightArea } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable/types';

export interface HighlightProps {
    xAxisMap?: XAxisMap;
    yAxisMap?: YAxisMap;
    offset?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
        width: number;
        height: number;
    };
    chartHighlight: ChartHighlightArea;
}
