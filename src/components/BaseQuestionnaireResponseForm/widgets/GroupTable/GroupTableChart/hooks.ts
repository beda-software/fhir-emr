import { Coding } from 'fhir/r4b';
import _ from 'lodash';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { TooltipProps } from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';
import type { BaseAxisProps } from 'recharts/types/util/types';
import { FCEQuestionnaireItem } from 'sdc-qrf';

import { GroupTableChartProps } from './types';
import { GroupTableRow } from '../types';
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
    const [answerOptionsX, setAnswerOptionsX] = useState<Coding[]>([]);

    useEffect(() => {
        const questionItemY = dataSource.find((item) => item[linkIdY]?.questionnaireItem)?.[linkIdY]?.questionnaireItem;
        setAnswerOptionsY(questionItemY ? questionnaireItemChoiceOptions(questionItemY) : []);
        const questionItemX = dataSource.find((item) => item[linkIdX]?.questionnaireItem)?.[linkIdX]?.questionnaireItem;
        setAnswerOptionsX(questionItemX ? questionnaireItemChoiceOptions(questionItemX) : []);
    }, [dataSource, linkIdX, linkIdY]);

    const getDataValue = (answerOptions: Coding[], groupTableRow: GroupTableRow, linkId: string) => {
        const hasAnswerOptions = answerOptions.length > 0;

        if (hasAnswerOptions) {
            const groupTableItem = groupTableRow[linkId];
            return groupTableItem ? mapChoiceToNumber(groupTableItem, answerOptions) : -1;
        }

        const formItem = groupTableRow[linkId]?.formItem;
        const questionnaireItemType = groupTableRow[linkId]?.questionnaireItem?.type;
        if (!isFormAnswerItems(formItem) || !questionnaireItemType) {
            return null;
        }
        return getFormAnswerItemFirstValue(formItem, questionnaireItemType, needsFormattedValue);
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
                const valueX = getDataValue(answerOptionsX, item, linkIdX);
                const valueY = getDataValue(answerOptionsY, item, linkIdY);

                return {
                    name: item.key,
                    x: valueX,
                    y: valueY,
                };
            });

        const questionItem = dataSource.find((source) => source[linkIdY]?.questionnaireItem !== undefined)?.[linkIdY]
            ?.questionnaireItem;

        const yAxisName = questionItem?.text ?? 'Value';

        return { data, yAxisName };
    }, [answerOptionsX, answerOptionsY, dataSource, linkIdX, linkIdY]);

    const xAxisType: BaseAxisProps['type'] = data.some((d) => d && _.isNumber(d.x)) ? 'number' : 'category';

    const yAxisType: BaseAxisProps['type'] = data.some((d) => d && _.isNumber(d.y)) ? 'number' : 'category';

    const getYParams = useCallback((): {
        domainY: BaseAxisProps['domain'];
        yAxisWidth: number;
        tickFormatterY: BaseAxisProps['tickFormatter'];
        tooltipFormatterY: TooltipProps<string | number, string>['formatter'];
        tickCountY: number | undefined;
    } => {
        const hasAnswerOptions = answerOptionsY.length > 0;

        if (hasAnswerOptions) {
            return {
                domainY: [0, answerOptionsY.length - 1],
                yAxisWidth: 30,
                tickFormatterY: (value) => {
                    return _.isInteger(value) ? answerOptionsY[value]?.display ?? '' : '';
                },
                tooltipFormatterY: (value) => {
                    return _.isNumber(value) ? [answerOptionsY[value]?.display, yAxisName] : ['', yAxisName];
                },
                tickCountY: answerOptionsY.length,
            };
        }

        return {
            domainY: ['auto', 'auto'],
            yAxisWidth: yAxisType === 'number' ? 10 : 30,
            tickFormatterY: undefined,
            tooltipFormatterY: undefined,
            tickCountY: undefined,
        };
    }, [answerOptionsY, yAxisName, yAxisType]);

    const getXParams = useCallback((): {
        domainX: BaseAxisProps['domain'];
        tickFormatterX: BaseAxisProps['tickFormatter'];
        labelFormatterX: (label: any, payload: Payload<string | number, string>[]) => ReactNode;
        tickCountX: number | undefined;
    } => {
        const hasAnswerOptions = answerOptionsX.length > 0;

        if (hasAnswerOptions) {
            return {
                domainX: [0, answerOptionsX.length - 1],
                tickFormatterX: (value) => {
                    return _.isInteger(value) ? answerOptionsX[value]?.display ?? '' : '';
                },
                labelFormatterX: (value) => {
                    return _.isNumber(value) ? answerOptionsX[value]?.display : '';
                },
                tickCountX: answerOptionsX.length,
            };
        }

        return {
            domainX: ['auto', 'auto'],
            tickFormatterX: undefined,
            labelFormatterX: (label) => label,
            tickCountX: undefined,
        };
    }, [answerOptionsX]);

    const yParams = getYParams();
    const xParams = getXParams();

    return {
        data,
        xAxisType,
        yAxisType,
        ...yParams,
        ...xParams,
    };
}
