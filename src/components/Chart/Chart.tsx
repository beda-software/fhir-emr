/* eslint-disable react-refresh/only-export-components */
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
import { useTheme } from 'styled-components';

import { ChartDatumBase, ChartProps } from './Chart.types';

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
        yDomain = ['auto', 'auto'],
        yTicks,
        yTickFormatter,
        yLineDomain,
        yLineTicks,
        yLineTickFormatter,
        onPointClick,
        height = 340,
        margin = { left: 20, right: 20, top: 20, bottom: 20 },
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

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
                data={data}
                margin={margin}
                onClick={(state) => {
                    if (!onPointClick || state.activeTooltipIndex == null) {
                        return;
                    }
                    const datum = data[state.activeTooltipIndex as number];
                    if (datum) {
                        onPointClick(datum);
                    }
                }}
            >
                <CartesianGrid
                    strokeWidth={0.5}
                    stroke={theme.neutralPalette.gray_5}
                    zIndex={1}
                    syncWithTicks={true}
                    {...gridProps}
                />
                <XAxis dataKey="x" fontSize={10} {...xAxisProps} />
                <YAxis
                    yAxisId="left"
                    fontSize={10}
                    domain={yDomain}
                    ticks={yTicks}
                    tickFormatter={yTickFormatter}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={2}
                    {...yAxisProps}
                />
                {variant === 'bar+line' && (
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        fontSize={10}
                        domain={yLineDomain}
                        ticks={yLineTicks}
                        tickFormatter={yLineTickFormatter}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={2}
                        width={28}
                        {...yLineAxisProps}
                    />
                )}

                <Tooltip cursor={{ fill: 'transparent' }} {...tooltipProps} />
                {variant === 'bar+line' && (
                    <Legend align="center" iconSize={8} wrapperStyle={{ fontSize: 10 }} {...legendProps} />
                )}

                {(variant === 'bar' || variant === 'bar+line') && (
                    <Bar yAxisId="left" dataKey="y" fill={theme.primaryPalette.bcp_6} opacity={0.4} {...barProps} />
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
                        stroke={theme.success}
                        strokeWidth={2}
                        connectNulls={false}
                        dot={{
                            fill: theme.success,
                        }}
                        activeDot={{ r: 4, stroke: theme.neutralPalette.gray_3, strokeWidth: 2 }}
                        {...lineProps}
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
