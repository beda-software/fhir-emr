import { Appointment } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { SearchBarColumnType } from 'src/components/SearchBar/types';
import { ResourceCalendarPage } from 'src/uberComponents/ResourceCalendarPage';

import { useNewScheduling } from './hooks';

export function NewScheduling() {
    const { eventData, slotData } = useNewScheduling();

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
            getFilters={(values) => [
                {
                    id: 'healthcare-service',
                    searchParam: 'service-type',
                    type: SearchBarColumnType.REFERENCE,
                    placeholder: 'Healthcare Service',
                    expression: `HealthcareService`,
                    path: 'HealthcareService.id',
                },
                {
                    id: 'practitioner',
                    searchParam: 'actor',
                    type: SearchBarColumnType.REFERENCE,
                    expression: `PractitionerRole?_include=PractitionerRole:practitioner&service=${
                        values['healthcare-service']?.value.Reference.reference ?? ''
                    }`,
                    path: "%Practitioner.where(id=%context.practitioner.reference.split('/')[1]).select(name.given.first() + ' ' + name.family)",
                    placeholder: `Find practitioner`,
                    placement: ['search-bar'],
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
}
