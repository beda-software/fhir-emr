import { scaleLinear } from 'd3-scale';
import { Coding } from 'fhir/r4b';
import _ from 'lodash';
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import type { TooltipContentProps, TooltipProps } from 'recharts';
import type { TickFormatter } from 'recharts/types/cartesian/CartesianAxis';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { AxisDomain, AxisDomainTypeInput } from 'recharts/types/util/types';
import { FCEQuestionnaireItem, FormGroupItems } from 'sdc-qrf';
import { useTheme } from 'styled-components';

import { Tooltip } from './Tooltip';
import { ChartType, GroupTableChartProps } from './types';
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
        const questionnaireItem = groupTableRow[linkId]?.questionnaireItem;
        const questionnaireItemType = questionnaireItem?.type;

        const isGroupItem = questionnaireItemType === 'group';
        if (isGroupItem) {
            const groupFormItem = formItem as FormGroupItems | undefined;
            const groupQuestionnaireItems = questionnaireItem?.item ?? [];
            return groupQuestionnaireItems.map((item) => {
                const childAnswerItems = groupFormItem?.items?.[item.linkId];
                if (!childAnswerItems || !isFormAnswerItems(childAnswerItems)) {
                    return null;
                }
                return getFormAnswerItemFirstValue(childAnswerItems, item.type, needsFormattedValue);
            });
        }

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

    const getChartType = useCallback((): ChartType => (data.some((d) => Array.isArray(d.y)) ? 'bar' : 'line'), [data]);

    const normalizeValues = (value: unknown) => (Array.isArray(value) ? value : [value]);
    const hasNumberValue = (value: unknown) => normalizeValues(value).some((item) => _.isNumber(item));
    const formatChartValue = (value: unknown) => {
        if (Array.isArray(value)) {
            return value.map((item) => (item ?? '').toString()).join('/');
        }
        return value ?? '';
    };

    const xAxisType: AxisDomainTypeInput = data.some((d) => d && hasNumberValue(d.x)) ? 'number' : 'category';

    const yAxisType: AxisDomainTypeInput = data.some((d) => d && hasNumberValue(d.y)) ? 'number' : 'category';

    const getYParams = useCallback((): {
        domainY: AxisDomain;
        yAxisWidth: number;
        tickFormatterY: TickFormatter | undefined;
        tooltipContent: TooltipProps<ValueType, NameType>['content'];
        tickCountY: number | undefined;
    } => {
        const hasAnswerOptionsY = answerOptionsY.length > 0;
        const hasAnswerOptionsX = answerOptionsX.length > 0;

        const tooltipContent: TooltipProps<ValueType, NameType>['content'] = ({
            label,
            payload,
        }: TooltipContentProps<ValueType, NameType>) => {
            if (!payload || payload?.length === 0) {
                return null;
            }

            const labelIndex =
                _.isNumber(label) || (_.isString(label) && _.isInteger(Number(label))) ? Number(label) : undefined;
            const labelTextRaw =
                hasAnswerOptionsX && labelIndex !== undefined ? answerOptionsX[labelIndex]?.display : label;
            const labelText = labelTextRaw !== undefined && labelTextRaw !== null ? labelTextRaw.toString() : undefined;

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
                tickFormatterY: (value: number | string) => {
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
            const values = normalizeValues(d.y);
            const numbers = values.filter((value) => _.isNumber(value)) as number[];
            return numbers.length > 0 ? [...acc, ...numbers] : acc;
        }, [] as number[]);

        const dataValuesString = data.reduce((acc, d) => {
            if (d === undefined || d === null) {
                return acc;
            }
            const values = normalizeValues(d.y);
            const strings = values.filter((value) => _.isString(value)) as string[];
            return strings.length > 0 ? [...acc, ...strings] : acc;
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
            tooltipContent: ({ label, payload }: TooltipContentProps<ValueType, NameType>) => {
                if (!payload || payload?.length === 0) {
                    return null;
                }

                const hasAnswerOptionsX = answerOptionsX.length > 0;
                const labelIndex =
                    _.isNumber(label) || (_.isString(label) && _.isInteger(Number(label))) ? Number(label) : undefined;
                const labelTextRaw =
                    hasAnswerOptionsX && labelIndex !== undefined ? answerOptionsX[labelIndex]?.display : label;
                const labelText =
                    labelTextRaw !== undefined && labelTextRaw !== null ? labelTextRaw.toString() : undefined;
                const values = payload.map((p) => `${formatChartValue(p.payload.y)} ${yAxisLabel}`);
                return <Tooltip values={values} label={labelText} />;
            },
            tickCountY: d3Ticks.length,
        };
    }, [answerOptionsX, answerOptionsY, chartYRange, data, getMaxTickWidth, yAxisLabel]);

    const getXParams = useCallback((): {
        domainX: AxisDomain;
        tickFormatterX: TickFormatter | undefined;
        tickCountX: number | undefined;
    } => {
        const hasAnswerOptions = answerOptionsX.length > 0;

        if (hasAnswerOptions) {
            return {
                domainX: [0, answerOptionsX.length - 1],
                tickFormatterX: (value: number | string) => {
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
        getChartType,
        ...yParams,
        ...xParams,
    };
}
