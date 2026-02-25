import _ from 'lodash';
import { useMemo } from 'react';
import type { TooltipProps } from 'recharts';
import type { BaseAxisProps } from 'recharts/types/util/types';

import { GroupTableChartProps } from './types';
import {
    getFormAnswerItemFirstValue,
    getGroupTableItemSorter,
    isFormAnswerItems,
    mapChoiceToNumber,
    questionnaireItemChoiceOptions,
} from '../utils';

export function useGroupTableChart(props: GroupTableChartProps) {
    const { dataSource, linkIdX, linkIdY } = props;

    const { data, options, tickFormatterY, domainY, tickCountY, tooltipFormatterY } = useMemo(() => {
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

        const questionItem = dataSource.find((source) => source[linkIdY]?.questionnaireItem !== undefined)?.[linkIdY]
            ?.questionnaireItem;

        const options = questionItem ? questionnaireItemChoiceOptions(questionItem) : [];

        const yAxisName = questionItem?.text ?? 'value';

        const tickFormatterY: BaseAxisProps['tickFormatter'] =
            options.length > 0
                ? (value) => {
                      return _.isInteger(value) ? options[value]?.display ?? '' : '';
                  }
                : undefined;

        const domainY: BaseAxisProps['domain'] = options.length > 0 ? [0, options.length - 1] : ['auto', 'auto'];

        const tickCountY = options.length > 0 ? options.length : undefined;

        const tooltipFormatterY: TooltipProps<string | number, string>['formatter'] =
            options.length > 0
                ? (value) => {
                      return _.isNumber(value) ? [options[value]?.display, yAxisName] : ['', yAxisName];
                  }
                : (value) => [value, yAxisName];

        return { data, options, tickFormatterY, domainY, tickCountY, tooltipFormatterY };
    }, [dataSource, linkIdX, linkIdY]);

    const xAxisType: BaseAxisProps['type'] = data.some((d) => d && _.isNumber(d.x)) ? 'number' : 'category';

    const yAxisType: BaseAxisProps['type'] = data.some((d) => d && _.isNumber(d.y)) ? 'number' : 'category';

    const yAxisWidth = options.length === 0 && yAxisType === 'number' ? 10 : 30;
    return {
        data,
        xAxisType,
        yAxisType,
        options,
        tickFormatterY,
        domainY,
        tickCountY,
        tooltipFormatterY,
        yAxisWidth,
    };
}
