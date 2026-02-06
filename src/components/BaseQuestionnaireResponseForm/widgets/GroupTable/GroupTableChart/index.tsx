import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { RepeatableGroupTableRow } from '../types';

interface GroupTableChartProps {
    dataSource: RepeatableGroupTableRow[];
    linkIdX: string | undefined;
    linkIdY: string | undefined;
}

export function GroupTableChart(props: GroupTableChartProps) {
    const { dataSource, linkIdX, linkIdY } = props;

    const data = dataSource.map((item) => {
        if (!linkIdX || !linkIdY) {
            return null;
        }
        return {
            name: item.key,
            x: item[linkIdX]?.formItem?.[0]?.value?.date,
            value: item[linkIdY]?.formItem?.[0]?.value?.Quantity?.value,
        };
    });

    return (
        <ResponsiveContainer width="100%" height={'100%'}>
            <ComposedChart margin={{ top: 8, right: 20, left: 10, bottom: 8 }} data={data}>
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                <XAxis
                    interval="preserveStartEnd"
                    dataKey="x"
                    axisLine={false}
                    tickLine={{ transform: 'translate(0, -6)' }}
                />
                <YAxis
                    dataKey="value"
                    domain={['auto', 'auto']}
                    interval={'preserveStartEnd'}
                    width={40}
                    allowDataOverflow={false}
                    alignmentBaseline="baseline"
                    axisLine={false}
                />
                <CartesianGrid />
                {/*<CartesianAxis display={'none'} />*/}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
