import { Appointment, PractitionerRole } from 'shared/src/contrib/aidbox';

import { getTimeSlots } from './utils';

describe('DateTimeSLot utils test', () => {
    test('getTimeSlots works correctly', async () => {
        const slotDuration = '00:15:00';
        const practitionerRole: PractitionerRole = {
            id: 'pr',
            resourceType: 'PractitionerRole',
            availableTime: [
                {
                    daysOfWeek: ['fri'],
                    availableEndTime: '10:00:00',
                    availableStartTime: '08:00:00',
                },
                {
                    daysOfWeek: ['wed'],
                    availableEndTime: '13:30:00',
                    availableStartTime: '13:00:00',
                },
                {
                    daysOfWeek: ['wed'],
                    availableEndTime: '17:00:00',
                    availableStartTime: '16:30:00',
                },
            ]
        }
        jest.useFakeTimers().setSystemTime(new Date('2023-02-15T13:00:00.000Z'));

        expect(getTimeSlots(practitionerRole, appointments, slotDuration)).toEqual(
            groupedTimeSlots,
        );
        jest.clearAllTimers();
    });
});

const groupedTimeSlots = [
    {
        date: '2023-02-17',
        timeSlots: [
            '2023-02-17T07:00:00Z',
            '2023-02-17T07:15:00Z',
            '2023-02-17T07:30:00Z',
            '2023-02-17T07:45:00Z',
            '2023-02-17T08:45:00Z',
        ],
    },
    {
        date: '2023-02-22',
        timeSlots: [
            '2023-02-22T12:00:00Z',
            '2023-02-22T12:15:00Z',
            '2023-02-22T15:30:00Z',
            '2023-02-22T15:45:00Z',
        ],
    },
    {
        date: '2023-02-24',
        timeSlots: [
            '2023-02-24T07:00:00Z',
            '2023-02-24T07:15:00Z',
            '2023-02-24T07:30:00Z',
            '2023-02-24T07:45:00Z',
            '2023-02-24T08:00:00Z',
            '2023-02-24T08:15:00Z',
            '2023-02-24T08:30:00Z',
            '2023-02-24T08:45:00Z',
        ],
    },
    {
        date: '2023-03-01',
        timeSlots: [
            '2023-03-01T12:00:00Z',
            '2023-03-01T12:15:00Z',
            '2023-03-01T15:30:00Z',
            '2023-03-01T15:45:00Z',
        ],
    },
    {
        date: '2023-03-03',
        timeSlots: [
            '2023-03-03T07:00:00Z',
            '2023-03-03T07:15:00Z',
            '2023-03-03T07:30:00Z',
            '2023-03-03T07:45:00Z',
            '2023-03-03T08:00:00Z',
            '2023-03-03T08:15:00Z',
            '2023-03-03T08:30:00Z',
            '2023-03-03T08:45:00Z',
        ],
    },
];

const appointments: Appointment[] = [
    {
        end: '2023-02-15T16:15:00Z',
        start: '2023-02-15T15:30:00Z',
        status: 'booked',
        participant: [
            {
                actor: {
                    id: 'eb857fa8-3eac-4e6f-9591-5d6100a34855',
                    display: 'John Smith',
                    resourceType: 'Patient',
                },
                status: 'accepted',
            },
            {
                actor: {
                    id: 'ae1fdea9-1b7d-45c8-a766-17150a4f8456',
                    display: 'Tompson Peter - Endocrinology',
                    resourceType: 'PractitionerRole',
                },
                status: 'accepted',
            },
            {
                actor: {
                    id: 'consultation',
                    resourceType: 'HealthcareService',
                },
                status: 'accepted',
            },
        ],
        serviceType: [
            {
                text: 'The first appointment',
                coding: [
                    {
                        code: 'consultation',
                        system: 'http://fhir.org/guides/argonaut-scheduling/CodeSystem/visit-type',
                        display: 'The first appointment',
                    },
                ],
            },
        ],
        id: '9416e93f-a528-4825-8b04-cb3d6d2f387a',
        resourceType: 'Appointment',
        meta: {
            lastUpdated: '2023-02-13T08:53:43.011772Z',
            createdAt: '2023-02-13T08:53:43.011772Z',
            versionId: '12785',
        },
    },
    {
        end: '2023-02-17T08:45:00Z',
        start: '2023-02-17T08:00:00Z',
        status: 'booked',
        participant: [
            {
                actor: {
                    id: '8236f4c0-7569-4936-badf-c8dc23362e1a',
                    display: 'Peter Li',
                    resourceType: 'Patient',
                },
                status: 'accepted',
            },
            {
                actor: {
                    id: 'ae1fdea9-1b7d-45c8-a766-17150a4f8456',
                    display: 'Tompson Peter - Endocrinology',
                    resourceType: 'PractitionerRole',
                },
                status: 'accepted',
            },
            {
                actor: {
                    id: 'consultation',
                    resourceType: 'HealthcareService',
                },
                status: 'accepted',
            },
        ],
        serviceType: [
            {
                text: 'The first appointment',
                coding: [
                    {
                        code: 'consultation',
                        system: 'http://fhir.org/guides/argonaut-scheduling/CodeSystem/visit-type',
                        display: 'The first appointment',
                    },
                ],
            },
        ],
        id: 'dd478dc6-baca-4c88-a39f-10d02048e852',
        resourceType: 'Appointment',
        meta: {
            lastUpdated: '2023-02-15T15:56:25.582468Z',
            createdAt: '2023-02-15T15:56:25.582468Z',
            versionId: '13658',
        },
    },
];
