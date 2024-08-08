import { ValueSet } from '@beda.software/aidbox-types';

export const valuesetEncounterStatusData: ValueSet = {
    description:
        'Current state of the encounter. This is not the clinical state of the patient, but the state of the encounter itself.',
    compose: {
        include: [
            {
                system: 'http://hl7.org/fhir/encounter-status',
                concept: [
                    {
                        code: 'planned',
                        display: 'Planned',
                    },
                    {
                        code: 'in-progress',
                        display: 'In Progress',
                    },
                    {
                        code: 'on-hold',
                        display: 'On Hold',
                    },
                    {
                        code: 'discharged',
                        display: 'Discharged',
                    },
                    {
                        code: 'finished',
                        display: 'Finished',
                    },
                    {
                        code: 'cancelled',
                        display: 'Cancelled',
                    },
                    {
                        code: 'entered-in-error',
                        display: 'Entered in Error',
                    },
                    {
                        code: 'unknown',
                        display: 'Unknown',
                    },
                ],
            },
        ],
    },
    meta: {
        lastUpdated: '2024-08-08T08:02:50.718168Z',
        createdAt: '2024-08-08T07:42:10.155157Z',
        versionId: '87',
    },
    publisher: 'HL7 (FHIR Project)',
    name: 'EncounterStatus',
    experimental: false,
    resourceType: 'ValueSet',
    title: 'Encounter Status',
    status: 'active',
    id: 'encounter-status',
    url: 'http://hl7.org/fhir/ValueSet/encounter-status',
    immutable: true,
    version: '5.0.0',
    contact: [
        {
            telecom: [
                {
                    value: 'http://hl7.org/fhir',
                    system: 'url',
                },
            ],
        },
    ],
};
