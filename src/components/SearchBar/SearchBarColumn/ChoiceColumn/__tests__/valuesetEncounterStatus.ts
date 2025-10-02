import { CodeSystem, ValueSet } from '@beda.software/aidbox-types';

export const codeSystemEncounterStatusData: CodeSystem = {
    id: 'encounter-status',
    resourceType: 'CodeSystem',
    status: 'active',
    url: 'http://hl7.org/fhir/encounter-status-test',
    name: 'encounter-status',
    content: 'complete',
    version: '0.0.1',
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
};

export const valuesetEncounterStatusData: ValueSet = {
    id: 'encounter-status',
    resourceType: 'ValueSet',
    name: 'EncounterStatus',
    status: 'active',
    description:
        'Current state of the encounter. This is not the clinical state of the patient, but the state of the encounter itself.',
    url: 'http://hl7.org/fhir/ValueSet/encounter-status-test',
    compose: {
        include: [
            {
                system: 'http://hl7.org/fhir/encounter-status-test',
            },
        ],
    },
};
