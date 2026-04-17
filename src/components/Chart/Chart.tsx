/* eslint-disable react-refresh/only-export-components */
import { Empty } from 'antd';
import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { MouseHandlerDataParam } from 'recharts';
import { useTheme } from 'styled-components';

import { ChartDatumBase, ChartProps } from './Chart.types';

const DEFAULT_MARGIN = { top: 12, right: 16, bottom: 8, left: 12 };
export const chartDotSpec = (stroke: string, fill: string) => ({
    r: 5,
    fill,
    stroke,
    strokeWidth: 2,
});

export const chartActiveDotSpec = (stroke: string, fill: string) => ({
    r: 6,
    fill,
    stroke,
    strokeWidth: 2,
});

export function Chart<TDatum extends ChartDatumBase = ChartDatumBase>(props: ChartProps<TDatum>) {
    const {
        variant,
        data,
        yDomain,
        yTicks,
        yTickFormatter,
        yLineDomain,
        yLineTicks,
        yLineTickFormatter,
        onPointClick,
        empty,
        height = 260,
        margin,
        xAxisProps,
        yAxisProps,
        yLineAxisProps,
        gridProps,
        legendProps,
        tooltipProps,
        barProps,
        lineProps,
        areaProps,
    } = props;
    const theme = useTheme();

    if (data.length === 0) {
        return empty === undefined ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <>{empty}</>;
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
                data={data}
                margin={{ ...DEFAULT_MARGIN, ...margin }}
                onClick={(event) => {
                    const activePayload = (
                        event as (MouseHandlerDataParam & { activePayload?: Array<{ payload?: TDatum }> }) | undefined
                    )?.activePayload;
                    const datum = activePayload?.[0]?.payload;
                    if (datum && onPointClick) {
                        onPointClick(datum);
                    }
                }}
            >
                <CartesianGrid strokeWidth={0.5} stroke={theme.neutralPalette.gray_5} syncWithTicks {...gridProps} />
                <XAxis dataKey="x" axisLine={false} tickLine={false} tickMargin={12} minTickGap={24} {...xAxisProps} />
                <YAxis
                    yAxisId="left"
                    domain={yDomain}
                    ticks={yTicks}
                    tickFormatter={yTickFormatter}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width="auto"
                    tickMargin={12}
                    {...yAxisProps}
                />
                {variant === 'bar+line' && (
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={yLineDomain}
                        ticks={yLineTicks}
                        tickFormatter={yLineTickFormatter}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                        width="auto"
                        tickMargin={12}
                        {...yLineAxisProps}
                    />
                )}

                <Tooltip cursor={{ fill: 'transparent' }} {...tooltipProps} />
                {legendProps && <Legend {...legendProps} />}

                {(variant === 'bar' || variant === 'bar+line') && (
                    <Bar
                        yAxisId="left"
                        dataKey="y"
                        fill={theme.primary}
                        radius={[8, 8, 0, 0]}
                        maxBarSize={32}
                        {...barProps}
                    />
                )}
                {variant === 'area' && (
                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="y"
                        stroke={theme.primary}
                        fill={theme.primary}
                        fillOpacity={0.15}
                        dot={false}
                        activeDot={{ r: 4 }}
                        {...areaProps}
                    />
                )}
                {variant === 'bar+line' && (
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="yLine"
                        stroke={theme.primaryPalette?.bcp_6 ?? theme.primary}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls={false}
                        activeDot={{ r: 5 }}
                        {...lineProps}
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
