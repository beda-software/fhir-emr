import {
    AreaChartOutlined,
    BarChartOutlined,
    DotChartOutlined,
    LineChartOutlined,
    PlusOutlined,
    RocketOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from 'antd';
import type { TooltipContentProps } from 'recharts';
import styled, { useTheme } from 'styled-components';

import { failure, loading, success } from '@beda.software/remote-data';

import { withColorSchemeDecorator } from 'src/storybook/decorators';

import { Chart } from './Chart';
import { ChartCard } from './ChartCard';

const categoricalLabels: Record<number, string> = {
    0: 'None',
    1: 'Low',
    2: 'Moderate',
    3: 'High',
    4: 'Very high',
};

const chartDataBar = [
    { x: 'Jan 4', y: 1 },
    { x: 'Jan 9', y: 2 },
    { x: 'Jan 14', y: 3 },
    { x: 'Jan 18', y: 2 },
    { x: 'Jan 23', y: 4 },
    { x: 'Jan 28', y: 3 },
];

const chartDataArea = [
    { x: 'W1', y: 2 },
    { x: 'W2', y: 3 },
    { x: 'W3', y: 5 },
    { x: 'W4', y: 4 },
    { x: 'W5', y: 6 },
    { x: 'W6', y: 7 },
    { x: 'W7', y: 5 },
    { x: 'W8', y: 8 },
    { x: 'W9', y: 6 },
    { x: 'W10', y: 7 },
    { x: 'W11', y: 9 },
    { x: 'W12', y: 8 },
];

const chartDataBarPlusLine = [
    { x: 'Mar 2', y: 1, yLine: 2 },
    { x: 'Mar 6', y: 2, yLine: 4 },
    { x: 'Mar 10', y: 3, yLine: 6 },
    { x: 'Mar 14', y: 2, yLine: 5 },
    { x: 'Mar 18', y: 4, yLine: 8 },
    { x: 'Mar 22', y: 3, yLine: 7 },
];

const rows = [
    { id: 'r1', label: 'Apr 1', severity: 1, score: 3 },
    { id: 'r2', label: 'Apr 5', severity: 3, score: 7 },
    { id: 'r3', label: 'Apr 9', severity: 2, score: 5 },
];
type StoryRow = (typeof rows)[number];

const flowLabels: Record<number, string> = {
    0: 'Very Light',
    1: 'Light',
    2: 'Moderate',
    3: 'Heavy',
    4: 'Very Heavy',
};

const painSeverityLabels: Record<number, string> = {
    0: 'No Pain',
    1: 'Mild',
    2: 'Moderate',
    3: 'Severe',
    4: 'Very Severe',
};

const hmbRows = [
    {
        id: 'hmb-1',
        label: '21 Nov 2025',
        flow: 1,
        painSeverity: 0,
        painScore: 1,
        impactScore: 6.1,
        intensity: 6.1,
    },
    {
        id: 'hmb-2',
        label: '19 Dec 2025',
        flow: 3,
        painSeverity: 3,
        painScore: 10,
        impactScore: 6.8,
        intensity: 6.8,
    },
    {
        id: 'hmb-3',
        label: '16 Jan 2026',
        flow: 4,
        painSeverity: 3,
        painScore: 6.3,
        impactScore: 7.9,
        intensity: 7.9,
    },
    {
        id: 'hmb-4',
        label: '13 Feb 2026',
        flow: 1,
        painSeverity: 2,
        painScore: 5.5,
        impactScore: 8.1,
        intensity: 8.1,
    },
    {
        id: 'hmb-5',
        label: '13 Mar 2026',
        flow: 2,
        painSeverity: 2,
        painScore: 5.5,
        impactScore: 7.3,
        intensity: 7.3,
    },
    {
        id: 'hmb-6',
        label: '10 Apr 2026',
        flow: 1,
        painSeverity: 0,
        painScore: 1,
        impactScore: 4.4,
        intensity: 4.4,
    },
];
type HMBStoryRow = (typeof hmbRows)[number];

const meta = {
    title: 'components / Chart',
    decorators: [withColorSchemeDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Bar: Story = {
    render: () => (
        <S.Frame>
            <Chart
                variant="bar"
                data={chartDataBar}
                yDomain={[0, 4]}
                yTicks={[0, 1, 2, 3, 4]}
                yTickFormatter={(value) => categoricalLabels[value] ?? String(value)}
            />
        </S.Frame>
    ),
};

export const Area: Story = {
    render: () => (
        <S.Frame>
            <Chart variant="area" data={chartDataArea} yDomain={[0, 10]} yTicks={[0, 2, 4, 6, 8, 10]} />
        </S.Frame>
    ),
};

export const BarPlusLine: Story = {
    render: () => (
        <S.Frame>
            <Chart
                variant="bar+line"
                data={chartDataBarPlusLine}
                yDomain={[0, 4]}
                yTicks={[0, 1, 2, 3, 4]}
                yTickFormatter={(value) => categoricalLabels[value] ?? String(value)}
                yLineDomain={[0, 10]}
                yLineTicks={[0, 2, 4, 6, 8, 10]}
            />
        </S.Frame>
    ),
};

export const Empty: Story = {
    render: () => (
        <S.Frame>
            <Chart variant="bar" data={[]} yDomain={[0, 4]} />
        </S.Frame>
    ),
};

export const CustomEmpty: Story = {
    render: () => (
        <S.Frame>
            <Chart variant="bar" data={[]} yDomain={[0, 4]} empty={<S.EmptyState>No readings yet</S.EmptyState>} />
        </S.Frame>
    ),
};

export const ChartCardLoading: Story = {
    render: () => (
        <S.CardFrame>
            <ChartCard<StoryRow>
                title="Symptom severity"
                icon={<BarChartOutlined />}
                variant="bar"
                rows={loading}
                transform={(chartRows) => chartRows.map((row) => ({ x: row.label, y: row.severity }))}
                yDomain={[0, 4]}
                yTicks={[0, 1, 2, 3, 4]}
            />
        </S.CardFrame>
    ),
};

export const ChartCardFailure: Story = {
    render: () => (
        <S.CardFrame>
            <ChartCard<StoryRow>
                title="Pain score"
                icon={<LineChartOutlined />}
                variant="area"
                rows={failure('boom')}
                transform={(chartRows) => chartRows.map((row) => ({ x: row.label, y: row.score }))}
                yDomain={[0, 10]}
                yTicks={[0, 2, 4, 6, 8, 10]}
            />
        </S.CardFrame>
    ),
};

export const ChartCardSuccess: Story = {
    render: () => (
        <S.CardFrame>
            <ChartCard<StoryRow>
                title="Severity vs score"
                icon={<DotChartOutlined />}
                variant="bar+line"
                rows={success(rows)}
                transform={(chartRows) =>
                    chartRows.map((row) => ({
                        x: row.label,
                        y: row.severity,
                        yLine: row.score,
                    }))
                }
                yDomain={[0, 4]}
                yTicks={[0, 1, 2, 3, 4]}
                yTickFormatter={(value) => categoricalLabels[value] ?? String(value)}
                yLineDomain={[0, 10]}
                yLineTicks={[0, 2, 4, 6, 8, 10]}
            />
        </S.CardFrame>
    ),
};

function makeHMBTooltip(props: {
    labelFormatter?: (label: string | number) => React.ReactNode;
    valueFormatter?: (value: number, key: string) => React.ReactNode;
}) {
    return function TooltipContent({ active, label, payload }: TooltipContentProps<any, any>) {
        if (!active || !payload?.length) {
            return null;
        }

        return (
            <S.TooltipCard>
                <S.TooltipTitle>{props.labelFormatter ? props.labelFormatter(label ?? '') : label}</S.TooltipTitle>
                {payload.map((entry) => (
                    <S.TooltipRow key={`${entry.dataKey ?? entry.name}-${entry.value}`}>
                        <S.TooltipMarker style={{ backgroundColor: entry.color ?? 'currentColor' }} />
                        <span>{entry.name}</span>
                        <strong>
                            {typeof entry.value === 'number' && props.valueFormatter
                                ? props.valueFormatter(entry.value, String(entry.dataKey ?? ''))
                                : entry.value}
                        </strong>
                    </S.TooltipRow>
                ))}
            </S.TooltipCard>
        );
    };
}

function HMBDashboardPreview() {
    const theme = useTheme();
    const lavender = theme.primaryPalette.bcp_4;
    const areaStroke = theme.primaryPalette.bcp_5;
    const painLine = theme.success;
    const legendStyle = {
        paddingTop: 24,
    };

    return (
        <S.HMBDashboard>
            <S.Actions>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add New HMB Data
                </Button>
            </S.Actions>

            <S.Grid>
                <ChartCard<HMBStoryRow>
                    title="Flow Volume"
                    icon={<BarChartOutlined />}
                    variant="bar"
                    rows={success(hmbRows)}
                    transform={(chartRows) => chartRows.map((row) => ({ x: row.label, y: row.flow }))}
                    yDomain={[-0.5, 4.5]}
                    yTicks={[0, 1, 2, 3, 4]}
                    yTickFormatter={(value) => flowLabels[value] ?? String(value)}
                    height={340}
                    margin={{ top: 20, right: 20, bottom: 8, left: 12 }}
                    gridProps={{ strokeDasharray: '4 4', stroke: theme.neutralPalette.gray_5 }}
                    barProps={{ fill: lavender, radius: [0, 0, 0, 0], maxBarSize: 68, name: 'Flow Volume' }}
                    tooltipProps={{
                        content: makeHMBTooltip({
                            valueFormatter: (value) => flowLabels[value] ?? String(value),
                        }),
                    }}
                    xAxisProps={{ minTickGap: 12 }}
                    yAxisProps={{ width: 'auto', tickMargin: 16 }}
                />

                <ChartCard<HMBStoryRow>
                    title="Period Pain Score"
                    icon={<ThunderboltOutlined />}
                    variant="bar+line"
                    rows={success(hmbRows)}
                    transform={(chartRows) =>
                        chartRows.map((row) => ({
                            x: row.label,
                            y: row.painSeverity,
                            yLine: row.painScore,
                        }))
                    }
                    yDomain={[-0.5, 4.5]}
                    yTicks={[0, 1, 2, 3, 4]}
                    yTickFormatter={(value) => painSeverityLabels[value] ?? String(value)}
                    yLineDomain={[1, 10]}
                    yLineTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    height={340}
                    margin={{ top: 20, right: 20, bottom: 24, left: 12 }}
                    gridProps={{ strokeDasharray: '4 4', stroke: theme.neutralPalette.gray_5 }}
                    barProps={{ fill: lavender, opacity: 0.55, maxBarSize: 68, name: 'Pain Presence' }}
                    lineProps={{
                        stroke: painLine,
                        strokeWidth: 2,
                        dot: { r: 5, fill: theme.neutralPalette.gray_1, stroke: painLine, strokeWidth: 2 },
                        activeDot: { r: 6, fill: theme.neutralPalette.gray_1, stroke: painLine, strokeWidth: 2 },
                        name: 'Pain Score',
                    }}
                    legendProps={{ align: 'center', verticalAlign: 'bottom', iconSize: 12, wrapperStyle: legendStyle }}
                    tooltipProps={{
                        content: makeHMBTooltip({
                            valueFormatter: (value, key) =>
                                key === 'y' ? painSeverityLabels[value] ?? String(value) : String(value),
                        }),
                    }}
                    xAxisProps={{ minTickGap: 12 }}
                    yAxisProps={{ width: 'auto', tickMargin: 16 }}
                    yLineAxisProps={{ width: 28, tickMargin: 8 }}
                />

                <ChartCard<HMBStoryRow>
                    title="Impact of Period on Daily Activities"
                    icon={<RocketOutlined />}
                    variant="area"
                    rows={success(hmbRows)}
                    transform={(chartRows) => chartRows.map((row) => ({ x: row.label, y: row.impactScore }))}
                    yDomain={[0, 10]}
                    yTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    height={340}
                    margin={{ top: 20, right: 20, bottom: 8, left: 12 }}
                    gridProps={{ strokeDasharray: '4 4', stroke: theme.neutralPalette.gray_5 }}
                    areaProps={{
                        stroke: areaStroke,
                        fill: areaStroke,
                        fillOpacity: 0.16,
                        strokeWidth: 2,
                        dot: { r: 5, fill: theme.neutralPalette.gray_1, stroke: areaStroke, strokeWidth: 2 },
                        activeDot: { r: 6, fill: theme.neutralPalette.gray_1, stroke: areaStroke, strokeWidth: 2 },
                        name: 'Impact Score',
                    }}
                    tooltipProps={{
                        content: makeHMBTooltip({
                            valueFormatter: (value) => value.toFixed(1),
                        }),
                    }}
                    xAxisProps={{ minTickGap: 12 }}
                    yAxisProps={{ width: 28, tickMargin: 8 }}
                />

                <ChartCard<HMBStoryRow>
                    title="Intensity of Menstrual Bleeding"
                    icon={<AreaChartOutlined />}
                    variant="area"
                    rows={success(hmbRows)}
                    transform={(chartRows) => chartRows.map((row) => ({ x: row.label, y: row.intensity }))}
                    yDomain={[0, 10]}
                    yTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    height={340}
                    margin={{ top: 20, right: 20, bottom: 8, left: 12 }}
                    gridProps={{ strokeDasharray: '4 4', stroke: theme.neutralPalette.gray_5 }}
                    areaProps={{
                        stroke: areaStroke,
                        fill: areaStroke,
                        fillOpacity: 0.16,
                        strokeWidth: 2,
                        dot: { r: 5, fill: theme.neutralPalette.gray_1, stroke: areaStroke, strokeWidth: 2 },
                        activeDot: { r: 6, fill: theme.neutralPalette.gray_1, stroke: areaStroke, strokeWidth: 2 },
                        name: 'Intensity',
                    }}
                    tooltipProps={{
                        content: makeHMBTooltip({
                            valueFormatter: (value) => value.toFixed(1),
                        }),
                    }}
                    xAxisProps={{ minTickGap: 12 }}
                    yAxisProps={{ width: 28, tickMargin: 8 }}
                />
            </S.Grid>
        </S.HMBDashboard>
    );
}

export const HMBDashboardPreviewStory: Story = {
    name: 'HMB Dashboard Preview',
    render: () => <HMBDashboardPreview />,
};

const S = {
    Frame: styled.div`
        width: 720px;
        height: 320px;
    `,
    CardFrame: styled.div`
        width: 720px;
    `,
    EmptyState: styled.div`
        height: 100%;
        min-height: 260px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.neutral.secondaryText};
    `,
    HMBDashboard: styled.div`
        width: 1420px;
        max-width: 100%;
    `,
    Actions: styled.div`
        margin-bottom: 16px;
    `,
    Grid: styled.div`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;

        @media (max-width: 1100px) {
            grid-template-columns: 1fr;
        }
    `,
    TooltipCard: styled.div`
        min-width: 180px;
        padding: 12px;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_5};
        border-radius: 10px;
        background: ${({ theme }) => theme.neutralPalette.gray_1};
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    `,
    TooltipTitle: styled.div`
        margin-bottom: 8px;
        font-size: 12px;
        color: ${({ theme }) => theme.neutralPalette.gray_8};
    `,
    TooltipRow: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;

        & + & {
            margin-top: 6px;
        }

        strong {
            margin-left: auto;
        }
    `,
    TooltipMarker: styled.span`
        width: 10px;
        height: 10px;
        border-radius: 999px;
        flex: 0 0 auto;
    `,
};
