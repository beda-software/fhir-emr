import { Patient, Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { buildDynamicColumns } from 'src/containers/MagicSearchPage/utils';
import { ResourceListPageContent } from 'src/uberComponents/ResourceListPageContent';

import { AIChartViewChart } from './AIChartViewChart';
import { AIChartTableWidgetConfig, AIChartWidgetConfig, scopeSearchParamsToPatient } from './utils';

interface Props {
    patient: WithId<Patient>;
    widget: AIChartWidgetConfig;
}

export function AIChartResourceList({ patient, widget }: Props) {
    if (widget.kind === 'chart') {
        return <AIChartViewChart patient={patient} widget={widget} />;
    }

    return <AIChartTableResourceList patient={patient} widget={widget} />;
}

function AIChartTableResourceList({ patient, widget }: { patient: WithId<Patient>; widget: AIChartTableWidgetConfig }) {
    const { resourceType, searchParams, tableColumns } = widget.query;

    return (
        <ResourceListPageContent<Resource>
            resourceType={resourceType}
            searchParams={{
                _sort: '-_lastUpdated,_id',
                _count: 10,
                ...scopeSearchParamsToPatient(resourceType, searchParams, patient.id),
            }}
            getTableColumns={() => buildDynamicColumns<Resource>(tableColumns)}
            maxWidth="100%"
        />
    );
}
