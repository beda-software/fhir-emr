import { Coding } from 'fhir/r4b';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import type { TooltipProps } from 'recharts';
import type { BaseAxisProps } from 'recharts/types/util/types';
import { FCEQuestionnaireItem } from 'sdc-qrf';

import { GroupTableChartProps } from './types';
import {
    getFormAnswerItemFirstValue,
    getGroupTableItemSorter,
    isFormAnswerItems,
    mapChoiceToNumber,
    questionnaireItemChoiceOptions,
} from '../utils';

const needsFormattedValue = (type: FCEQuestionnaireItem['type']) =>
    ['dateTime', 'date', 'time', 'boolean'].includes(type);

export function useGroupTableChart(props: GroupTableChartProps) {
    const { dataSource, linkIdX, linkIdY } = props;

    const [answerOptionsY, setAnswerOptionsY] = useState<Coding[]>([]);

    const hasAnswerOptionsY = useMemo(() => answerOptionsY.length > 0, [answerOptionsY.length]);

    const hasAnswerOptions = (questionItem?: FCEQuestionnaireItem) => {
        return questionItem && questionnaireItemChoiceOptions(questionItem).length > 0 ? true : false;
    };

    const getAnswerOptions = (questionItem?: FCEQuestionnaireItem) => {
        return questionItem ? questionnaireItemChoiceOptions(questionItem) : [];
    };

    const { data, yAxisName } = useMemo(() => {
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
                const valueX = getFormAnswerItemFirstValue(formItemX, questionnaireItemXType, needsFormattedValue);

                const formItemY = item[linkIdY]?.formItem;
                const questionnaireItemYType = item[linkIdY]?.questionnaireItem?.type;
                if (!isFormAnswerItems(formItemY) || !questionnaireItemYType) {
                    return null;
                }
                const valueY = getFormAnswerItemFirstValue(formItemY, questionnaireItemYType, needsFormattedValue);

                if (hasAnswerOptions(item[linkIdY]?.questionnaireItem)) {
                    const questionYAnswerOptions = getAnswerOptions(item[linkIdY]?.questionnaireItem);
                    setAnswerOptionsY(questionYAnswerOptions);
                    const itemY = item[linkIdY];
                    const valueYNumber = itemY ? mapChoiceToNumber(itemY, questionYAnswerOptions) : -1;
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

        const yAxisName = questionItem?.text ?? 'Value';

        return { data, yAxisName };
    }, [dataSource, linkIdX, linkIdY]);

    const xAxisType: BaseAxisProps['type'] = data.some((d) => d && _.isNumber(d.x)) ? 'number' : 'category';

    const yAxisType: BaseAxisProps['type'] = data.some((d) => d && _.isNumber(d.y)) ? 'number' : 'category';

    const yAxisWidth = useMemo(
        () => (!hasAnswerOptionsY && yAxisType === 'number' ? 10 : 30),
        [hasAnswerOptionsY, yAxisType],
    );

    const domainY: BaseAxisProps['domain'] = useMemo(
        () => (hasAnswerOptionsY ? [0, answerOptionsY.length - 1] : ['auto', 'auto']),
        [hasAnswerOptionsY, answerOptionsY.length],
    );

    const tickFormatterY: BaseAxisProps['tickFormatter'] = useMemo(
        () =>
            hasAnswerOptionsY
                ? (value) => {
                      return _.isInteger(value) ? answerOptionsY[value]?.display ?? '' : '';
                  }
                : undefined,
        [answerOptionsY, hasAnswerOptionsY],
    );

    const tooltipFormatterY: TooltipProps<string | number, string>['formatter'] = useMemo(
        () =>
            hasAnswerOptionsY
                ? (value) => {
                      return _.isNumber(value) ? [answerOptionsY[value]?.display, yAxisName] : ['', yAxisName];
                  }
                : (value) => [value, yAxisName],
        [hasAnswerOptionsY, answerOptionsY, yAxisName],
    );

    const tickCountY: number | undefined = useMemo(
        () => (hasAnswerOptionsY ? answerOptionsY.length : undefined),
        [hasAnswerOptionsY, answerOptionsY.length],
    );

    return {
        data,
        xAxisType,
        yAxisType,
        tickFormatterY,
        domainY,
        tickCountY,
        tooltipFormatterY,
        yAxisWidth,
    };
}
