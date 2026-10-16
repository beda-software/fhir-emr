import { t } from '@lingui/macro';
import { Button } from 'antd';
import { Patient } from 'fhir/r4b';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';

import { ResourceDetailPage, Tab } from 'src/uberComponents/ResourceDetailPage';
import { renderHumanName } from 'src/utils';

import { AIChartDashboard } from './AIChartDashboard';
import { AIChartResourceList } from './AIChartResourceList';
import { useAIChartWidgets } from './hooks';

export function AIChart() {
    const { widgets, addWidget, removeWidget } = useAIChartWidgets();

    const tabs: Array<Tab<WithId<Patient>>> = useMemo(
        () => [
            {
                path: '',
                label: t`Dashboard`,
                component: ({ resource }) => (
                    <AIChartDashboard
                        patient={resource}
                        widgets={widgets}
                        addWidget={addWidget}
                        removeWidget={removeWidget}
                    />
                ),
            },
            // Every widget gets its own tab with all resources matching the widget query
            ...widgets.map(
                (widget): Tab<WithId<Patient>> => ({
                    path: widget.id,
                    label: widget.prompt,
                    component: ({ resource }) => (
                        <AIChartResourceList key={widget.id} patient={resource} widget={widget} />
                    ),
                }),
            ),
        ],
        [widgets, addWidget, removeWidget],
    );

    return (
        <ResourceDetailPage<Patient>
            resourceType="Patient"
            getSearchParams={({ id }) => ({ _id: id })}
            getTitle={({ resource }) => `${t`AI Chart`}: ${renderHumanName(resource.name?.[0])}`}
            getTitleRightElement={({ resource }) => (
                <Link to={`/patients/${resource.id}`}>
                    <Button>{t`Open patient chart`}</Button>
                </Link>
            )}
            tabs={tabs}
            maxWidth="100%"
        />
    );
}
