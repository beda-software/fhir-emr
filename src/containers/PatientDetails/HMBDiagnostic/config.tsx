/* eslint-disable react-refresh/only-export-components */
import { AreaChartOutlined, BarChartOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import type { DefaultTheme } from 'styled-components';

import { chartActiveDotSpec, chartDotSpec, ChartCardProps } from 'src/components/Chart';

import { flowTooltip, numericTooltip, painTooltip } from './HMBTooltip';
import { getChartDisplayLabel, toFlowVolume, toImpact, toIntensity, toPainScore } from './transforms';
import { flowAxis } from './transforms/toFlowVolume';
import { severityAxis } from './transforms/toPainScore';
import { HMBChartDatum, HMBResponseRow } from './types';

type HMBChartConfig = Omit<ChartCardProps<HMBResponseRow, HMBChartDatum>, 'rows' | 'onPointClick'>;

const NUMERIC_DOMAIN: [number, number] = [0, 10];
const NUMERIC_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const getHMBCharts = (theme: DefaultTheme): HMBChartConfig[] => {
    const areaStroke = theme.primaryPalette.bcp_5;
    const gray_1 = theme.neutralPalette.gray_1;

    const areaSpec = {
        stroke: areaStroke,
        fill: areaStroke,
        fillOpacity: 0.16,
        strokeWidth: 2,
        dot: chartDotSpec(areaStroke, gray_1),
        activeDot: chartActiveDotSpec(areaStroke, gray_1),
    };

    const flow = flowAxis();
    const severity = severityAxis();

    return [
        {
            xAxisProps: { tickFormatter: getChartDisplayLabel },
            ...flow.chartProps,
            title: t`Flow Volume`,
            icon: <BarChartOutlined />,
            variant: 'bar',
            transform: toFlowVolume,
            barProps: { name: 'Flow Volume' },
            tooltipProps: { content: flowTooltip },
            yAxisProps: { width: 90 },
        },
        {
            xAxisProps: { tickFormatter: getChartDisplayLabel },
            ...severity.chartProps,
            title: t`Period Pain Score`,
            icon: <HeartOutlined />,
            variant: 'bar+line',
            transform: toPainScore,
            yLineDomain: [1, 10],
            yLineTicks: NUMERIC_TICKS,
            barProps: { name: 'Pain Presence' },
            lineProps: {
                name: 'Pain Score',
            },
            tooltipProps: { content: painTooltip },
            yAxisProps: { width: 100 },
        },
        {
            xAxisProps: { tickFormatter: getChartDisplayLabel },
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
            xAxisProps: { tickFormatter: getChartDisplayLabel },
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
