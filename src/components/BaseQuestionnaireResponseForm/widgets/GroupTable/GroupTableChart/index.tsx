import { Empty } from 'antd';
import {
    CartesianGrid,
    ComposedChart,
    Customized,
    Label,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

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
    } = useGroupTableChart(props);

    return (
        <>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" style={{ padding: '0 12px' }}>
                    <ComposedChart
                        margin={{ top: marginTopBottom, right: 0, left: 0, bottom: marginTopBottom }}
                        data={data}
                    >
                        {props.chartHighlightAreas?.map((chartHighlight) => (
                            <Customized
                                key={`${chartHighlight.from}-${chartHighlight.to}`}
                                component={HighlightArea}
                                chartHighlight={chartHighlight}
                            />
                        ))}
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} />
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
                        <CartesianGrid strokeWidth={0.5} color={'#b1b1b1'} syncWithTicks={true} />
                        <Tooltip content={tooltipContent} />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </>
    );
}
