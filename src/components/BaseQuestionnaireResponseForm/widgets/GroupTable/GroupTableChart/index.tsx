import { Empty } from 'antd';
import _ from 'lodash';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { GroupTableRow } from '../types';
import {
    getFormAnswerItemFirstValue,
    getGroupTableItemSorter,
    isFormAnswerItems,
    mapChoiceToNumber,
    questionnaireItemChoiceOptions,
} from '../utils';

interface GroupTableChartProps {
    dataSource: GroupTableRow[];
    linkIdX: string;
    linkIdY: string;
}

export function GroupTableChart(props: GroupTableChartProps) {
    const { dataSource, linkIdX, linkIdY } = props;

    const data = dataSource
        .sort((a, b) => {
            const questionItem = a[linkIdX]?.questionnaireItem ?? b[linkIdX]?.questionnaireItem;
            if (!questionItem) {
                return 0;
            }
            return getGroupTableItemSorter(questionItem, linkIdX)(a, b);
        })
        .map((item) => {
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
            if (questionnaireItemYType === 'choice' || questionnaireItemYType === 'open-choice') {
                const questionItem = item[linkIdY]?.questionnaireItem;
                const options = questionItem ? questionnaireItemChoiceOptions(questionItem) : [];
                const itemY = item[linkIdY];
                const valueYNumber = itemY ? mapChoiceToNumber(itemY, options) : -1;
                return {
                    name: item.key,
                    x: valueX,
                    y: valueYNumber,
                    yLabel: valueY,
                };
            }

            return {
                name: item.key,
                x: valueX,
                y: valueY,
                yLabel: valueY,
            };
        });

    const xAxisType = data[0]?.x ? (_.isNumber(data[0]?.x) ? 'number' : 'category') : 'category';

    const yAxisType = data.some((d) => d && _.isNumber(d.y)) ? 'number' : 'category';

    const questionItem = dataSource.find((source) => source[linkIdY]?.questionnaireItem !== undefined)?.[linkIdY]
        ?.questionnaireItem;
    const options = questionItem ? questionnaireItemChoiceOptions(questionItem) : [];
    console.log('options', options);
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
                            // domain={['auto', 'auto']}
                            padding={{ left: 60, right: 60 }}
                            // axisLine={{ stroke: 'red', strokeWidth: 2 }}
                            tickLine={{ transform: 'translate(0, -6)', strokeWidth: 0.5 }}
                            // tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 600 }}
                            // tickLine={false}
                        />
                        <YAxis
                            type={yAxisType}
                            dataKey="y"
                            // domain={['auto', 'auto']}
                            domain={[0, options.length - 1]}
                            interval={'preserveStartEnd'}
                            // interval={0}
                            tickCount={options.length}
                            width={30}
                            allowDataOverflow={false}
                            alignmentBaseline="baseline"
                            axisLine={false}
                            // axisLine={{ stroke: 'red', strokeWidth: 2 }}
                            tickFormatter={(value) => {
                                return _.isInteger(value) ? options[value]?.display ?? '' : '';
                            }}
                            tick={{ fontSize: 10, fontWeight: 600 }}
                            tickLine={{ transform: 'translate(6, 0)', strokeWidth: 0.5 }}
                            // tickLine={false}
                            padding={{ top: 10, bottom: 10 }}
                            // hide={true}
                        />
                        <CartesianGrid
                            // strokeDasharray={'3 3'}
                            strokeWidth={0.5}
                            color={'#b1b1b1'}
                            // horizontalValues={data.map((d) => d.y)}
                            syncWithTicks={true}
                            // verticalValues={data.map((d) => d.x)}
                        />

                        <Tooltip
                            formatter={(value) => {
                                return _.isNumber(value) ? [options[value]?.display, 'Pain level'] : ['', ''];
                            }}
                            cursor={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </>
    );
}
