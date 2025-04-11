import { RenderRemoteData } from '@beda.software/fhir-react';

import { SearchBarColumnType } from 'src/components/SearchBar/types';

import { useNewScheduling } from './hooks';
import { getEventConfig } from './utils';
import { CalendarPage } from '../../uberComponents/CalendarPage';

export function NewScheduling() {
    const { remoteResponses } = useNewScheduling();

    return (
        <RenderRemoteData remoteData={remoteResponses}>
            {({ practitionerRoleFilterOptions, healthcareServiceFilterOptions }) => {
                return (
                    <CalendarPage
                        resourceType="Appointment"
                        headerTitle="Scheduling new"
                        searchParams={{
                            _include: ['Appointment:patient', 'Appointment:actor:PractitionerRole'],
                        }}
                        getFilters={() => [
                            {
                                id: 'patient',
                                type: SearchBarColumnType.REFERENCE,
                                placeholder: 'Search by patient',
                                expression: 'Patient',
                                path: "name.given.first() + ' ' + name.family",
                            },
                            {
                                id: 'practitioner-role',
                                searchParam: 'actor',
                                type: SearchBarColumnType.CHOICE,
                                placeholder: 'Practitioner',
                                options: practitionerRoleFilterOptions,
                            },
                            {
                                id: 'healthcare-service',
                                searchParam: 'service-type',
                                type: SearchBarColumnType.CHOICE,
                                placeholder: 'Healthcare Service',
                                options: healthcareServiceFilterOptions,
                            },
                        ]}
                        eventConfig={getEventConfig}
                    />
                );
            }}
        </RenderRemoteData>
    );
}
