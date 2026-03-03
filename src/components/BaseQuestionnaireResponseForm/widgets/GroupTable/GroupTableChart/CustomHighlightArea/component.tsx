import { CustomHighlightProps } from './types';
import { getHighlightYParams } from './utils';

export function CustomHighlightArea(props: CustomHighlightProps) {
    const { xAxisMap, yAxisMap, offset, chartHighlight } = props;
    const { color } = chartHighlight;

    const xAxis = xAxisMap?.[0];
    const yAxis = yAxisMap?.[0];
    if (!xAxis || !yAxis || !offset) {
        return null;
    }

    const yParams = getHighlightYParams(props);
    if (!yParams) {
        return null;
    }
    const { y, height } = yParams;

    return (
        <rect
            x={offset.left}
            width={offset.width}
            y={y}
            height={height}
            stroke="#00000000"
            fill={color ?? '#ff000022'}
        />
    );
}
