import { Appointment } from 'fhir/r4b';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceCalendarPage } from 'src/uberComponents/ResourceCalendarPage';

import { useNewScheduling } from './hooks';

export function NewScheduling() {
    const { remoteResponses, eventData, slotData } = useNewScheduling();

    return (
        <RenderRemoteData remoteData={remoteResponses}>
            {({ practitionerRoleFilterOptions, healthcareServiceFilterOptions }) => {
                return (
                    <ResourceCalendarPage<WithId<Appointment>>
                        resourceType="Appointment"
                        headerTitle="Scheduling new"
                        searchParams={{
                            'status:not': 'cancelled',
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
                        event={eventData}
                        slot={slotData}
                        calendarOptions={{
                            businessHours: {
                                daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Monday - Thursday
                                startTime: '10:00', // a start time (10am in this example)
                                endTime: '18:00', // an end time (6pm in this example)
                            },
                            slotMinTime: '09:00:00',
                            slotMaxTime: '19:00:00',
                        }}
                    />
                );
            }}
        </RenderRemoteData>
    );
}
