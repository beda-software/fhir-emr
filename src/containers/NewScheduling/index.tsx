import { Appointment } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceCalendarPage } from 'src/uberComponents/ResourceCalendarPage';

import { EventContent } from './EventContent';
import { useNewScheduling } from './hooks';
import { getEventConfig } from './utils';

export function NewScheduling() {
    const { remoteResponses, calendarQuestionnaireActions } = useNewScheduling();

    return (
        <RenderRemoteData remoteData={remoteResponses}>
            {({ practitionerRoleFilterOptions, healthcareServiceFilterOptions }) => {
                return (
                    <ResourceCalendarPage<Appointment>
                        resourceType="Appointment"
                        headerTitle="Scheduling new"
                        searchParams={{
                            _include: [
                                'Appointment:patient',
                                'Appointment:actor:PractitionerRole',
                                'PractitionerRole:practitioner',
                                'PractitionerRole:service',
                            ],
                        }}
                        getFilters={() => [
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
                        event={{ dataFn: getEventConfig, view: EventContent }}
                        calendarEventActions={calendarQuestionnaireActions}
                    />
                );
            }}
        </RenderRemoteData>
    );
}
