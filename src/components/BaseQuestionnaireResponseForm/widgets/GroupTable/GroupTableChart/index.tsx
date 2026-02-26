import { Empty } from 'antd';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useGroupTableChart } from './hooks';
import { GroupTableChartProps } from './types';

export function GroupTableChart(props: GroupTableChartProps) {
    const {
        data,
        xAxisType,
        yAxisType,
        domainX,
        tickCountX,
        tickFormatterX,
        labelFormatterX,
        tickFormatterY,
        domainY,
        tickCountY,
        tooltipFormatterY,
        yAxisWidth,
    } = useGroupTableChart(props);

    return (
        <>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart margin={{ top: 18, right: 20, left: 30, bottom: 8 }} data={data}>
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} />
                        <XAxis
                            type={xAxisType}
                            interval="preserveStartEnd"
                            dataKey="x"
                            axisLine={false}
                            domain={domainX}
                            padding={{ left: 60, right: 60 }}
                            tickCount={tickCountX}
                            tickLine={{ transform: 'translate(0, -6)', strokeWidth: 0.5 }}
                            tickFormatter={tickFormatterX}
                            tick={{ fontSize: 10, fontWeight: 600 }}
                        />
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
                            tick={{ fontSize: 10, fontWeight: 600 }}
                            tickLine={{ transform: 'translate(6, 0)', strokeWidth: 0.5 }}
                            padding={{ top: 10, bottom: 10 }}
                        />
                        <CartesianGrid strokeWidth={0.5} color={'#b1b1b1'} syncWithTicks={true} />

                        <Tooltip formatter={tooltipFormatterY} labelFormatter={labelFormatterX} cursor={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </>
    );
}
