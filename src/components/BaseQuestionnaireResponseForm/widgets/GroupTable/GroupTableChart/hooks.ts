import { scaleLinear } from 'd3-scale';
import { Coding } from 'fhir/r4b';
import _ from 'lodash';
import { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { TooltipProps } from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';
import type { BaseAxisProps } from 'recharts/types/util/types';
import { FCEQuestionnaireItem } from 'sdc-qrf';
import { useTheme } from 'styled-components';

import { GroupTableChartProps } from './types';
import { getCanvasTextWidth } from './utils';
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
    const { dataSource, linkIdX, linkIdY, chartYRange, tickCSSProperties, labelCSSProperties } = props;

    const [answerOptionsY, setAnswerOptionsY] = useState<Coding[]>([]);
    const [answerOptionsX, setAnswerOptionsX] = useState<Coding[]>([]);

    useEffect(() => {
        const questionItemY = dataSource.find((item) => item[linkIdY]?.questionnaireItem)?.[linkIdY]?.questionnaireItem;
        setAnswerOptionsY(questionItemY ? questionnaireItemChoiceOptions(questionItemY) : []);
        const questionItemX = dataSource.find((item) => item[linkIdX]?.questionnaireItem)?.[linkIdX]?.questionnaireItem;
        setAnswerOptionsX(questionItemX ? questionnaireItemChoiceOptions(questionItemX) : []);
    }, [dataSource, linkIdX, linkIdY]);
    const theme = useTheme();

    const defaultFontSize = 10;
    const defaultFontWeight = 600;
    const axisWidthExtra = 10;

    const defaultCSSProperties: CSSProperties = useMemo(
        () => ({
            fontSize: defaultFontSize,
            fontWeight: defaultFontWeight,
            fill: theme.neutral.primaryText,
            textWrapMode: 'nowrap',
            textOverflow: 'clip',
        }),
        [theme.neutral.primaryText],
    );

    const mergedTickCSSProperties: CSSProperties = useMemo(
        () => ({ ...defaultCSSProperties, ...tickCSSProperties }),
        [defaultCSSProperties, tickCSSProperties],
    );

    const mergedLabelCSSProperties: CSSProperties = useMemo(
        () => ({ ...defaultCSSProperties, ...labelCSSProperties }),
        [defaultCSSProperties, labelCSSProperties],
    );

    const labelFontSize =
        mergedLabelCSSProperties?.fontSize && _.isNumber(mergedLabelCSSProperties?.fontSize)
            ? mergedLabelCSSProperties?.fontSize
            : defaultFontSize;

    const marginTopBottom = labelFontSize * 1.6;
    const xAxisLabelDy = labelFontSize * 0.6;
    const yAxisLabelDy = -labelFontSize * 1.6;

    const getTickTextWidth = useCallback(
        (value: number | string) => {
            const fontSize = _.isNumber(mergedTickCSSProperties.fontSize)
                ? mergedTickCSSProperties.fontSize
                : defaultFontSize;
            const fontWeight = _.isNumber(mergedTickCSSProperties.fontWeight)
                ? mergedTickCSSProperties.fontWeight
                : defaultFontWeight;
            return getCanvasTextWidth({ text: value.toString(), fontSize, fontWeight });
        },
        [mergedTickCSSProperties.fontSize, mergedTickCSSProperties.fontWeight],
    );

    const getMaxTickWidth = useCallback(
        (ticks: number[] | string[]) => {
            return _.max(ticks.map((tick) => getTickTextWidth(tick))) ?? 0;
        },
        [getTickTextWidth],
    );

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

    const { data, yAxisName, yAxisLabel, xAxisLabel } = useMemo(() => {
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

        const questionItemY = dataSource.find((source) => source[linkIdY]?.questionnaireItem !== undefined)?.[linkIdY]
            ?.questionnaireItem;
        const questionItemX = dataSource.find((source) => source[linkIdY]?.questionnaireItem !== undefined)?.[linkIdX]
            ?.questionnaireItem;

        const yAxisName = questionItemY?.text ?? 'Value';
        const yAxisLabel =
            questionItemY?.unitOption?.[0]?.display ?? questionItemY?.unit?.display ?? questionItemY?.text;
        const xAxisLabel =
            questionItemX?.unitOption?.[0]?.display ?? questionItemX?.unit?.display ?? questionItemX?.text;

        return { data, yAxisName, yAxisLabel, xAxisLabel };
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
            const yAxisWidth = getMaxTickWidth(answerOptionsY.map((option) => option.display ?? '')) + axisWidthExtra;

            return {
                domainY: [0, answerOptionsY.length - 1],
                yAxisWidth,
                tickFormatterY: (value) => {
                    return _.isInteger(value) ? answerOptionsY[value]?.display ?? '' : '';
                },
                tooltipFormatterY: (value) => {
                    return _.isNumber(value) ? [answerOptionsY[value]?.display, yAxisName] : ['', yAxisName];
                },
                tickCountY: answerOptionsY.length,
            };
        }

        const dataValues = data.reduce((acc, d) => {
            if (d === undefined || d === null) {
                return acc;
            }
            return _.isNumber(d.y) ? [...acc, d.y] : acc;
        }, [] as number[]);
        const d3Scale = scaleLinear()
            .domain([_.min([...dataValues, chartYRange?.[0]]), _.max([...dataValues, chartYRange?.[1]])])
            .nice();
        const d3Domain = d3Scale.domain();
        const d3Ticks = d3Scale.ticks();
        const yAxisWidth = getMaxTickWidth(d3Ticks) + axisWidthExtra;

        return {
            domainY: d3Domain,
            yAxisWidth: yAxisWidth,
            tickFormatterY: undefined,
            tooltipFormatterY: undefined,
            tickCountY: d3Ticks.length,
        };
    }, [answerOptionsY, chartYRange, data, getMaxTickWidth, yAxisName]);

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
        yAxisLabel,
        xAxisLabel,
        tickCSSProperties: mergedTickCSSProperties,
        labelCSSProperties: mergedLabelCSSProperties,
        marginTopBottom,
        xAxisLabelDy,
        yAxisLabelDy,
        ...yParams,
        ...xParams,
    };
}
