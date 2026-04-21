/* eslint-disable react-refresh/only-export-components */
import { AreaChartOutlined, BarChartOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import type { DefaultTheme } from 'styled-components';

import { chartActiveDotSpec, chartDotSpec, ChartCardProps } from 'src/components/Chart';

import { flowTooltip, numericTooltip, painTooltip } from './HMBTooltip';
import {
    getChartDisplayLabel,
    flowTicks,
    flowYTickFormatter,
    severityTicks,
    severityYTickFormatter,
    toFlowVolume,
    toImpact,
    toIntensity,
    toPainScore,
} from './transforms';
import { HMBChartDatum, HMBResponseRow } from './types';

type HMBChartConfig = Omit<ChartCardProps<HMBResponseRow, HMBChartDatum>, 'rows' | 'onPointClick'>;

const CHART_HEIGHT = 340;
const CATEGORICAL_DOMAIN: [number, number] = [-0.5, 4.5];
const NUMERIC_DOMAIN: [number, number] = [0, 10];
const NUMERIC_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const CATEGORY_AXIS_WIDTH = 90;
const LEGEND_STYLE = { paddingTop: 24 };

const COMMON: Partial<HMBChartConfig> = {
    height: CHART_HEIGHT,
    margin: { top: 20, right: 20, bottom: 8, left: 12 },
    xAxisProps: { minTickGap: 12, interval: 'preserveStartEnd', tickFormatter: getChartDisplayLabel },
    gridProps: { horizontal: false, strokeDasharray: '4 4' },
    yAxisProps: { width: CATEGORY_AXIS_WIDTH, tickMargin: 16 },
};

export const getHMBCharts = (theme: DefaultTheme): HMBChartConfig[] => {
    const lavender = theme.primaryPalette.bcp_4;
    const areaStroke = theme.primaryPalette.bcp_5;
    const painLine = theme.success;
    const gray_1 = theme.neutralPalette.gray_1;

    const areaSpec = {
        stroke: areaStroke,
        fill: areaStroke,
        fillOpacity: 0.16,
        strokeWidth: 2,
        dot: chartDotSpec(areaStroke, gray_1),
        activeDot: chartActiveDotSpec(areaStroke, gray_1),
    };

    return [
        {
            ...COMMON,
            compactIcon: true,
            title: t`Flow Volume`,
            icon: <BarChartOutlined />,
            variant: 'bar',
            transform: toFlowVolume,
            yDomain: CATEGORICAL_DOMAIN,
            yTicks: flowTicks,
            yTickFormatter: flowYTickFormatter,
            barProps: { fill: lavender, radius: [4, 4, 0, 0], maxBarSize: 40, opacity: 0.4, name: 'Flow Volume' },
            tooltipProps: { content: flowTooltip },
        },
        {
            ...COMMON,
            compactIcon: true,
            title: t`Period Pain Score`,
            icon: <HeartOutlined />,
            variant: 'bar+line',
            transform: toPainScore,
            yDomain: CATEGORICAL_DOMAIN,
            yTicks: severityTicks,
            yTickFormatter: severityYTickFormatter,
            yLineDomain: [1, 10],
            yLineTicks: NUMERIC_TICKS,
            margin: { ...COMMON.margin, bottom: 24 },
            barProps: { fill: lavender, radius: [4, 4, 0, 0], maxBarSize: 40, opacity: 0.4, name: 'Pain Presence' },
            lineProps: {
                stroke: painLine,
                strokeWidth: 2,
                dot: chartDotSpec(painLine, gray_1),
                activeDot: chartActiveDotSpec(painLine, gray_1),
                name: 'Pain Score',
            },
            legendProps: { align: 'center', verticalAlign: 'bottom', iconSize: 12, wrapperStyle: LEGEND_STYLE },
            tooltipProps: { content: painTooltip },
            yLineAxisProps: { width: 28, tickMargin: 8 },
        },
        {
            ...COMMON,
            compactIcon: true,
            title: t`Impact of Period on Daily Activities`,
            icon: <CalendarOutlined />,
            variant: 'area',
            transform: toImpact,
            yDomain: NUMERIC_DOMAIN,
            yTicks: NUMERIC_TICKS,
            areaProps: { ...areaSpec, name: 'Impact Score' },
            tooltipProps: { content: numericTooltip },
        },
        {
            ...COMMON,
            compactIcon: true,
            title: t`Intensity of Menstrual Bleeding`,
            icon: <AreaChartOutlined />,
            variant: 'area',
            transform: toIntensity,
            yDomain: NUMERIC_DOMAIN,
            yTicks: NUMERIC_TICKS,
            areaProps: { ...areaSpec, name: 'Intensity' },
            tooltipProps: { content: numericTooltip },
        },
    ];
};
