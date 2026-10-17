import { LineChartOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Bundle, Patient, Resource } from 'fhir/r4b';
import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Dashboard, WidgetInfo } from 'src/components/Dashboard/types';
import { DashboardCard } from 'src/components/DashboardCard';
import { buildMagicSearchColumns } from 'src/containers/MagicSearchPage/utils';
import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import { StandardCardContainerFabric } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric';

import { AIChartViewChart } from './AIChartViewChart';
import { RemoveWidgetButton } from './RemoveWidgetButton';
import {
    AIChartTableWidgetConfig,
    AIChartViewChartWidgetConfig,
    AIChartWidgetConfig,
    scopeSearchParamsToPatient,
} from './utils';

function prepareAIChartCard(widget: AIChartTableWidgetConfig) {
    const columns = buildMagicSearchColumns<Resource>(widget.query.tableColumns);

    return (resources: Resource[], bundle: Bundle<Resource>): OverviewCard<Resource> => ({
        title: widget.prompt,
        key: widget.id,
        icon: <UnorderedListOutlined />,
        data: resources,
        total: bundle.total,
        getKey: (r: Resource) => r.id!,
        columns: columns.map((column) => ({ ...column, render: (r: Resource) => column.render(r, bundle) })),
    });
}

function buildAIChartTableWidgetInfo(widget: AIChartTableWidgetConfig, onRemove: (id: string) => void): WidgetInfo {
    const { resourceType, searchParams } = widget.query;

    return {
        key: widget.id,
        query: {
            resourceType,
            search: (patient: Patient) => ({
                _sort: '-_lastUpdated,_id',
                _count: 7,
                ...scopeSearchParamsToPatient(resourceType, searchParams, patient.id!),
            }),
        },
        widget: StandardCardContainerFabric(prepareAIChartCard(widget), {
            // Relative link to the widget tab of the AI chart page that lists all matching resources
            to: widget.id,
            extraActions: <RemoveWidgetButton onClick={() => onRemove(widget.id)} />,
        }),
    };
}

function buildAIChartViewChartWidgetInfo(
    widget: AIChartViewChartWidgetConfig,
    onRemove: (id: string) => void,
): WidgetInfo {
    return {
        key: widget.id,
        widget: function AIChartViewChartCard({ patient }) {
            return (
                <AIChartViewChart
                    patient={patient}
                    widget={widget}
                    renderChart={(chart, data) => (
                        <DashboardCard
                            title={widget.prompt}
                            icon={<LineChartOutlined />}
                            empty={!data.length}
                            extra={
                                <>
                                    {/* Relative link to the widget tab of the AI chart page */}
                                    <Link to={widget.id}>
                                        <b>
                                            <Trans>See all</Trans>
                                            {` (${data.length})`}
                                        </b>
                                    </Link>
                                    <RemoveWidgetButton onClick={() => onRemove(widget.id)} />
                                </>
                            }
                        >
                            {chart}
                        </DashboardCard>
                    )}
                />
            );
        },
    };
}

function buildAIChartWidgetInfo(widget: AIChartWidgetConfig, onRemove: (id: string) => void): WidgetInfo {
    return widget.kind === 'chart'
        ? buildAIChartViewChartWidgetInfo(widget, onRemove)
        : buildAIChartTableWidgetInfo(widget, onRemove);
}

// Produces the dashboard context for PatientOverview out of AI chart widgets.
// Widget components are cached by id so existing cards are not remounted (and refetched) when the list changes.
export function useAIChartDashboard(widgets: AIChartWidgetConfig[], onRemove: (id: string) => void): Dashboard {
    const cache = useRef(new Map<string, WidgetInfo>());

    return useMemo(() => {
        const widgetInfos = widgets.map((widget) => {
            const cached = cache.current.get(widget.id) ?? buildAIChartWidgetInfo(widget, onRemove);
            cache.current.set(widget.id, cached);

            return cached;
        });

        return {
            default: {
                top: [],
                left: widgetInfos.filter((_, index) => index % 2 === 0),
                right: widgetInfos.filter((_, index) => index % 2 === 1),
                bottom: [],
            },
        };
    }, [widgets, onRemove]);
}
