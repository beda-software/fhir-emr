import { scaleLinear } from 'd3-scale';
import { Coding } from 'fhir/r4b';
import _ from 'lodash';
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import type { TooltipProps } from 'recharts';
import type { BaseAxisProps } from 'recharts/types/util/types';
import { FCEQuestionnaireItem } from 'sdc-qrf';
import { useTheme } from 'styled-components';

import { Tooltip } from './Tooltip';
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
    const axisWidthExtra = 8;

    const defaultCSSProperties: CSSProperties = useMemo(
        () => ({
            fontSize: defaultFontSize,
            fontWeight: defaultFontWeight,
            fill: theme.neutral.primaryText,
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

    const { data, yAxisLabel, xAxisLabel } = useMemo(() => {
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
        tooltipContent: TooltipProps<string | number, string>['content'];
        tickCountY: number | undefined;
    } => {
        const hasAnswerOptionsY = answerOptionsY.length > 0;
        const hasAnswerOptionsX = answerOptionsX.length > 0;

        const tooltipContent: TooltipProps<string | number, string>['content'] = ({ label, payload }) => {
            if (!payload || payload?.length === 0) {
                return null;
            }

            const labelText = hasAnswerOptionsX ? answerOptionsX[label]?.display : label;

            const values = payload.map((p) => {
                const payloadValue = hasAnswerOptionsY ? `${answerOptionsY[p?.payload.y]?.display}` : `${p.payload.y}`;
                return `${payloadValue} ${yAxisLabel}`;
            });
            return <Tooltip values={values} label={labelText} />;
        };

        if (hasAnswerOptionsY) {
            const yAxisWidth = getMaxTickWidth(answerOptionsY.map((option) => option.display ?? '')) + axisWidthExtra;

            return {
                domainY: [0, answerOptionsY.length - 1],
                yAxisWidth,
                tickFormatterY: (value) => {
                    return _.isInteger(value) ? answerOptionsY[value]?.display ?? '' : '';
                },
                tooltipContent,
                tickCountY: answerOptionsY.length,
            };
        }

        const dataValuesNum = data.reduce((acc, d) => {
            if (d === undefined || d === null) {
                return acc;
            }

            return _.isNumber(d.y) ? [...acc, d.y] : acc;
        }, [] as number[]);

        const dataValuesString = data.reduce((acc, d) => {
            if (d === undefined || d === null) {
                return acc;
            }
            const value = d.y;
            return _.isString(value) ? [...acc, value] : acc;
        }, [] as string[]);

        const d3Scale = scaleLinear()
            .domain([
                _.min([...dataValuesNum, ...(dataValuesString.length > 0 ? [0] : []), chartYRange?.[0]]),
                _.max([
                    ...dataValuesNum,
                    ...(dataValuesString.length > 0 ? [dataValuesString.length - 1] : []),
                    chartYRange?.[1],
                ]),
            ])
            .nice();
        const d3Domain = d3Scale.domain();
        const d3Ticks = d3Scale.ticks();
        const yAxisWidth = getMaxTickWidth(dataValuesNum.length > 0 ? d3Ticks : dataValuesString) + axisWidthExtra;

        return {
            domainY: d3Domain,
            yAxisWidth: yAxisWidth,
            tickFormatterY: undefined,
            tooltipContent: ({ label, payload }) => {
                if (!payload || payload?.length === 0) {
                    return null;
                }

                const hasAnswerOptionsX = answerOptionsX.length > 0;
                const labelText = hasAnswerOptionsX ? answerOptionsX[label]?.display : label;
                const values = payload.map((p) => `${p.payload.y} ${yAxisLabel}`);
                return <Tooltip values={values} label={labelText} />;
            },
            tickCountY: d3Ticks.length,
        };
    }, [answerOptionsX, answerOptionsY, chartYRange, data, getMaxTickWidth, yAxisLabel]);

    const getXParams = useCallback((): {
        domainX: BaseAxisProps['domain'];
        tickFormatterX: BaseAxisProps['tickFormatter'];
        tickCountX: number | undefined;
    } => {
        const hasAnswerOptions = answerOptionsX.length > 0;

        if (hasAnswerOptions) {
            return {
                domainX: [0, answerOptionsX.length - 1],
                tickFormatterX: (value) => {
                    return _.isInteger(value) ? answerOptionsX[value]?.display ?? '' : '';
                },
                tickCountX: answerOptionsX.length,
            };
        }

        return {
            domainX: ['auto', 'auto'],
            tickFormatterX: undefined,
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
