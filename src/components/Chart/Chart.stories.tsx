import { BarChartOutlined, DotChartOutlined, LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from 'antd';
import styled from 'styled-components';

import { failure, loading, success } from '@beda.software/remote-data';

import { getHMBCharts } from 'src/containers/PatientDetails/HMBDiagnostic/config';
import { S as HMBStyles } from 'src/containers/PatientDetails/HMBDiagnostic/styles';
import type { HMBChartDatum } from 'src/containers/PatientDetails/HMBDiagnostic/types';
import { withColorSchemeDecorator } from 'src/storybook/decorators';
import type { ReferenceChartRow } from 'src/uberComponents/ViewChart';

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
    { x: 'Jan 9', y: null },
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

const hmbStoryPoints = [
    {
        id: 'hmb-1',
        authored: '2025-11-21T09:00:00Z',
        flow: 'light',
        painSeverity: 'no-pain',
        painScore: 1,
        impactScore: 6.1,
        intensity: 6.1,
    },
    {
        id: 'hmb-2',
        authored: '2025-12-19T09:00:00Z',
        flow: 'heavy',
        painSeverity: 'severe',
        painScore: 10,
        impactScore: 6.8,
        intensity: 6.8,
    },
    {
        id: 'hmb-3',
        authored: '2026-01-16T09:00:00Z',
        flow: 'very-heavy',
        painSeverity: 'severe',
        painScore: 6.3,
        impactScore: 7.9,
        intensity: 7.9,
    },
    {
        id: 'hmb-4',
        authored: '2026-02-13T09:00:00Z',
        flow: 'light',
        painSeverity: 'moderate',
        painScore: 5.5,
        impactScore: 8.1,
        intensity: 8.1,
    },
    {
        id: 'hmb-5',
        authored: '2026-03-13T09:00:00Z',
        flow: 'moderate',
        painSeverity: 'moderate',
        painScore: 5.5,
        impactScore: 7.3,
        intensity: 7.3,
    },
    {
        id: 'hmb-6',
        authored: '2026-04-10T09:00:00Z',
        flow: 'light',
        painSeverity: 'no-pain',
        painScore: 1,
        impactScore: 4.4,
        intensity: 4.4,
    },
] as const;

// Each HMB chart is backed by its own narrow ViewDefinition, so the story fakes one
// ReferenceChartRow projection per metric out of the same underlying story points.
function toHMBStoryRows(
    pick: (point: (typeof hmbStoryPoints)[number]) => Pick<ReferenceChartRow, 'value_code' | 'value_integer'>,
): ReferenceChartRow[] {
    return hmbStoryPoints.map((point) => ({
        id: point.id,
        axis_label: point.authored,
        title: null,
        reference_range: null,
        value_quantity: null,
        ...pick(point),
    }));
}

const hmbRowsByChartId: Record<string, ReferenceChartRow[]> = {
    'flow-volume': toHMBStoryRows((point) => ({ value_code: point.flow, value_integer: null })),
    'pain-severity-score': toHMBStoryRows((point) => ({
        value_code: point.painSeverity,
        value_integer: point.painScore,
    })),
    'impact-score': toHMBStoryRows((point) => ({ value_code: null, value_integer: point.impactScore })),
    intensity: toHMBStoryRows((point) => ({ value_code: null, value_integer: point.intensity })),
};

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

function HMBDashboardPreview() {
    return (
        <S.HMBDashboard>
            <S.Actions>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add New HMB Data
                </Button>
            </S.Actions>

            <HMBStyles.Grid>
                {getHMBCharts().map((entry) => {
                    const storyRows = hmbRowsByChartId[entry.id] ?? [];
                    const config = typeof entry.config === 'function' ? entry.config(storyRows) : entry.config;

                    return (
                        <ChartCard<ReferenceChartRow, HMBChartDatum>
                            key={entry.id}
                            title={config.title}
                            icon={entry.icon}
                            rows={success(storyRows)}
                            {...config}
                        />
                    );
                })}
            </HMBStyles.Grid>
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
};
