import { usePlotArea, useYAxisScale } from 'recharts';

import { HighlightProps } from './types';
import { getHighlightYParams } from './utils';

export function HighlightArea(props: HighlightProps) {
    const { yAxisId = 0, chartHighlight } = props;
    const { color } = chartHighlight;

    const yScale = useYAxisScale(yAxisId);
    const plotArea = usePlotArea();

    if (!plotArea) {
        return null;
    }

    const yParams = getHighlightYParams({
        chartHighlight,
        plotArea,
        yAxisPadding: undefined,
        yScale,
    });
    if (!yParams) {
        return null;
    }
    const { y, height } = yParams;

    return (
        <rect
            x={plotArea.x}
            width={plotArea.width}
            y={y}
            height={height}
            stroke="#00000000"
            fill={color ?? '#ff000022'}
        />
    );
}
