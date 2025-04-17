import { RenderRemoteData } from '@beda.software/fhir-react';

import { SearchBarColumnType } from 'src/components/SearchBar/types';

import { newEventModal, detailsModal } from './EventActions';
import { useNewScheduling } from './hooks';
import { getEventConfig, getBusinessHours } from './utils';
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
                        eventConfig={getEventConfig}
                        businessHours={getBusinessHours}
                        newEventModal={newEventModal}
                        eventDetails={detailsModal}
                    />
                );
            }}
        </RenderRemoteData>
    );
}
