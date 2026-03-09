import _ from 'lodash';

import { HighlightParams } from './types';

const getPaddingValue = (padding?: number) => (padding && padding > 0 ? padding : 0);

export const getHighlightYParams = (props: HighlightParams): { y: number; height: number } | null => {
    const { chartHighlight, plotArea, yAxisPadding, yScale } = props;
    const { from, to } = chartHighlight;
    if (!plotArea || !yScale || !_.isFunction(yScale)) {
        return null;
    }

    const paddingTop = typeof yAxisPadding === 'object' ? getPaddingValue(yAxisPadding.top) : 0;
    const paddingBottom = typeof yAxisPadding === 'object' ? getPaddingValue(yAxisPadding.bottom) : 0;
    const minY = plotArea.y + paddingTop;
    const maxY = plotArea.y + plotArea.height - paddingBottom;

    const scaleY = (value: number) => yScale(value);
    // from and to
    if (from !== undefined && to !== undefined) {
        const startValue = scaleY(from);
        const endValue = scaleY(to);
        if (startValue === undefined || endValue === undefined) {
            return null;
        }
        const startY = Math.min(Math.max(startValue, minY), maxY);
        const endY = Math.min(Math.max(endValue, minY), maxY);
        return {
            y: Math.min(endY, startY),
            height: Math.abs(startY - endY),
        };
    }
    // only from
    if (from !== undefined) {
        const startValue = scaleY(from);
        if (startValue === undefined) {
            return null;
        }
        const startY = Math.min(Math.max(startValue, minY), maxY);
        return {
            y: minY,
            height: startY - minY,
        };
    }
    // only to
    const endValue = to !== undefined ? scaleY(to) : undefined;
    if (endValue === undefined) {
        return null;
    }
    const endY = Math.min(Math.max(endValue, minY), maxY);
    return {
        y: Math.max(endY, minY),
        height: maxY - endY,
    };
};
