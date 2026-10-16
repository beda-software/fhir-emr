import { Patient, Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { buildDynamicColumns } from 'src/containers/MagicSearchPage/utils';
import { ResourceListPageContent } from 'src/uberComponents/ResourceListPageContent';

import { AIChartWidgetConfig, scopeSearchParamsToPatient } from './utils';

interface Props {
    patient: WithId<Patient>;
    widget: AIChartWidgetConfig;
}

export function AIChartResourceList({ patient, widget }: Props) {
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
