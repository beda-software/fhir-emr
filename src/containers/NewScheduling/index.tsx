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
                                daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                                startTime: '10:00',
                                endTime: '18:00',
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
