/* eslint-disable react-refresh/only-export-components */
import { useId } from 'react';
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
import { ChartTooltip } from './ChartTooltip';
import { getChartDisplayLabel } from './formatters';

type HaloDotProps = { cx?: number; cy?: number };

const renderHaloDot = (stroke: string, fill: string, coreR: number, haloR: number) =>
    function HaloDot({ cx, cy }: HaloDotProps) {
        if (cx == null || cy == null) {
            return null;
        }
        return (
            <g>
                <circle cx={cx} cy={cy} r={haloR} fill={stroke} opacity={0.2} />
                <circle cx={cx} cy={cy} r={coreR} fill={fill} stroke={stroke} strokeWidth={1.5} />
            </g>
        );
    };

export const chartDotSpec = (stroke: string, fill: string) => renderHaloDot(stroke, fill, 4, 8);

export const chartActiveDotSpec = (stroke: string, fill: string) => renderHaloDot(stroke, fill, 5, 10);

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
        empty,
        height = 340,
        margin = { left: 0, right: 20, top: 20, bottom: 20 },
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
    const gradientId = useId();
    const areaStroke = theme.primaryPalette.bcp_5;
    const dotFill = theme.neutralPalette.gray_1;
    const areaColor = (areaProps?.stroke as string | undefined) ?? areaStroke;

    if (data.length === 0 && empty) {
        return <div style={{ width: '100%', height }}>{empty}</div>;
    }

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
                <XAxis
                    dataKey="x"
                    fontSize={10}
                    padding={variant === 'area' ? { left: 20, right: 20 } : undefined}
                    tickFormatter={getChartDisplayLabel}
                    {...xAxisProps}
                />
                <YAxis
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

                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={ChartTooltip}
                    labelFormatter={(label) =>
                        typeof label === 'string' || typeof label === 'number' ? getChartDisplayLabel(label) : label
                    }
                    {...tooltipProps}
                />
                {variant === 'bar+line' && (
                    <Legend align="center" iconSize={8} wrapperStyle={{ fontSize: 10 }} {...legendProps} />
                )}

                {(variant === 'bar' || variant === 'bar+line') && (
                    <Bar
                        dataKey="y"
                        fill={theme.primaryPalette.bcp_6}
                        opacity={0.4}
                        minPointSize={5}
                        activeBar={{ opacity: 1 }}
                        {...barProps}
                    />
                )}
                {variant === 'area' && (
                    <>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={areaColor} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={areaColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="y"
                            stroke={areaStroke}
                            strokeWidth={1}
                            dot={renderHaloDot(areaStroke, dotFill, 4, 8)}
                            activeDot={renderHaloDot(areaStroke, dotFill, 5, 10)}
                            {...areaProps}
                            fill={`url(#${gradientId})`}
                            fillOpacity={1}
                        />
                    </>
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
