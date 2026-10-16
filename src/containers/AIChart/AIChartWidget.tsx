import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, Tooltip } from 'antd';
import { Bundle, Patient, Resource } from 'fhir/r4b';
import { useMemo, useRef } from 'react';

import { Dashboard, WidgetInfo } from 'src/components/Dashboard/types';
import { buildMagicSearchColumns } from 'src/containers/MagicSearchPage/utils';
import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import { StandardCardContainerFabric } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric';

import { AIChartWidgetConfig, scopeSearchParamsToPatient } from './utils';

function prepareAIChartCard(widget: AIChartWidgetConfig) {
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

function buildAIChartWidgetInfo(widget: AIChartWidgetConfig, onRemove: (id: string) => void): WidgetInfo {
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
            extraActions: (
                <Tooltip title={t`Remove`}>
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onRemove(widget.id)}
                    />
                </Tooltip>
            ),
        }),
    };
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
