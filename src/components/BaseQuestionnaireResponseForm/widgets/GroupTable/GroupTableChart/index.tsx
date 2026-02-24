import { Empty } from 'antd';
import _ from 'lodash';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { GroupTableRow } from '../types';
import { getFormAnswerItemFirstValue, isFormAnswerItems } from '../utils';

interface GroupTableChartProps {
    dataSource: GroupTableRow[];
    linkIdX: string;
    linkIdY: string;
}

export function GroupTableChart(props: GroupTableChartProps) {
    const { dataSource, linkIdX, linkIdY } = props;

    const data = dataSource.map((item) => {
        const formItemX = item[linkIdX]?.formItem;
        const questionnaireItemXType = item[linkIdX]?.questionnaireItem?.type;
        if (!isFormAnswerItems(formItemX) || !questionnaireItemXType) {
            return null;
        }
        const valueX = getFormAnswerItemFirstValue(formItemX, questionnaireItemXType, (type) =>
            ['dateTime', 'date', 'time'].includes(type),
        );

        const formItemY = item[linkIdY]?.formItem;
        const questionnaireItemYType = item[linkIdY]?.questionnaireItem?.type;
        if (!isFormAnswerItems(formItemY) || !questionnaireItemYType) {
            return null;
        }
        const valueY = getFormAnswerItemFirstValue(formItemY, questionnaireItemYType, (type) =>
            ['dateTime', 'date', 'time'].includes(type),
        );

        return {
            name: item.key,
            x: valueX,
            y: valueY,
        };
    });

    const xAxisType = data[0]?.x ? (_.isNumber(data[0]?.x) ? 'number' : 'category') : 'category';

    const yAxisType = data[0]?.y ? (_.isNumber(data[0]?.y) ? 'number' : 'category') : 'category';

    return (
        <>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart margin={{ top: 8, right: 20, left: 10, bottom: 8 }} data={data}>
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} />
                        <XAxis
                            type={xAxisType}
                            interval="preserveStartEnd"
                            dataKey="x"
                            axisLine={false}
                            tickLine={{ transform: 'translate(0, -6)' }}
                        />
                        <YAxis
                            type={yAxisType}
                            dataKey="y"
                            domain={['auto', 'auto']}
                            interval={'preserveStartEnd'}
                            width={40}
                            allowDataOverflow={false}
                            alignmentBaseline="baseline"
                            axisLine={false}
                        />
                        <CartesianGrid />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </>
    );
}
