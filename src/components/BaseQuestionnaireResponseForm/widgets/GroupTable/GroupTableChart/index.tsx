import { Empty } from 'antd';
import { Bar, CartesianGrid, ComposedChart, Label, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from 'styled-components';

import { HighlightArea } from './HighlightArea';
import { useGroupTableChart } from './hooks';
import { GroupTableChartProps } from './types';

export function GroupTableChart(props: GroupTableChartProps) {
    const {
        data,
        xAxisType,
        yAxisType,
        yAxisLabel,
        xAxisLabel,
        domainX,
        tickCountX,
        tickFormatterX,
        tickFormatterY,
        domainY,
        tickCountY,
        tooltipContent,
        yAxisWidth,
        tickCSSProperties,
        labelCSSProperties,
        marginTopBottom,
        xAxisLabelDy,
        yAxisLabelDy,
        getChartType,
    } = useGroupTableChart(props);

    const theme = useTheme();

    const chartType = getChartType();

    return (
        <>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" style={{ padding: '0 12px' }}>
                    <ComposedChart
                        margin={{ top: marginTopBottom, right: 0, left: 0, bottom: marginTopBottom }}
                        data={data}
                    >
                        <CartesianGrid
                            strokeWidth={0.5}
                            stroke={theme.neutralPalette.gray_5}
                            zIndex={1}
                            syncWithTicks={true}
                        />
                        {props.chartHighlightAreas?.map((chartHighlight) => (
                            <HighlightArea
                                key={`${chartHighlight.from}-${chartHighlight.to}`}
                                chartHighlight={chartHighlight}
                            />
                        ))}
                        {chartType === 'line' && (
                            <Line type="monotone" dataKey="y" stroke={theme.primary} strokeWidth={1} />
                        )}
                        {chartType === 'bar' && (
                            <Bar
                                dataKey="y"
                                fill={theme.antdTheme?.magenta4}
                                stroke={theme.neutralPalette.gray_1}
                                strokeWidth={2}
                                maxBarSize={24}
                                radius={24}
                            />
                        )}
                        <XAxis
                            type={xAxisType}
                            interval="preserveStartEnd"
                            dataKey="x"
                            axisLine={false}
                            domain={domainX}
                            padding={{ left: 60, right: 60 }}
                            tickCount={tickCountX}
                            tickLine={false}
                            tickFormatter={tickFormatterX}
                            tick={{ style: tickCSSProperties }}
                        >
                            <Label
                                value={xAxisLabel}
                                position={'insideBottomRight'}
                                dy={xAxisLabelDy}
                                offset={0}
                                style={labelCSSProperties}
                            />
                        </XAxis>
                        <YAxis
                            type={yAxisType}
                            dataKey="y"
                            domain={domainY}
                            interval={'preserveStartEnd'}
                            tickCount={tickCountY}
                            width={yAxisWidth}
                            allowDataOverflow={false}
                            alignmentBaseline="baseline"
                            axisLine={false}
                            tickFormatter={tickFormatterY}
                            tick={{ style: tickCSSProperties }}
                            padding={{ top: 14, bottom: 14 }}
                            tickLine={false}
                            tickMargin={0}
                        >
                            <Label
                                value={yAxisLabel}
                                position={'insideTopLeft'}
                                dy={yAxisLabelDy}
                                offset={0}
                                style={labelCSSProperties}
                            />
                        </YAxis>
                        <Tooltip content={tooltipContent} />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </>
    );
}
