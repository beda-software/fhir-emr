import _ from 'lodash';

import { HighlightProps } from './types';

export const getHighlightYParams = (props: HighlightProps): { y: number; height: number } | null => {
    const { xAxisMap, yAxisMap, offset, chartHighlight } = props;
    const { from, to } = chartHighlight;

    const xAxis = xAxisMap?.[0];
    const yAxis = yAxisMap?.[0];

    if (!xAxis || !yAxis || !offset) {
        return null;
    }

    const scaleY = yAxis.scale;
    if (!_.isFunction(scaleY)) {
        return null;
    }

    const paddingTop = yAxis.padding?.top ?? 0;
    // from and to
    if (from !== undefined && to !== undefined) {
        const startY = Math.min(
            Math.max(scaleY(from), offset.top + paddingTop),
            offset.height + offset.top - paddingTop,
        );
        const endY = Math.min(Math.max(scaleY(to), offset.top + paddingTop), offset.height + offset.top - paddingTop);
        return {
            y: Math.min(endY, startY),
            height: Math.abs(startY - endY),
        };
    }
    // only from
    if (from !== undefined) {
        const startY = Math.min(
            Math.max(scaleY(from), offset.top + paddingTop),
            offset.height + offset.top - paddingTop,
        );
        return {
            y: offset.top + paddingTop,
            height: startY - (offset.top + paddingTop),
        };
    }
    // only to
    const endY = Math.min(Math.max(scaleY(to), offset.top + paddingTop), offset.height + offset.top - paddingTop);
    return {
        y: Math.max(scaleY(to), offset.top + paddingTop),
        height: offset.height + offset.top - paddingTop - endY,
    };
};
