import { act, renderHook } from '@testing-library/react';

import { getFHIRResource, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { parseFHIRDateTime } from 'aidbox-react/lib/utils/date';
import { ensure } from 'aidbox-react/lib/utils/tests';

import { Encounter, Questionnaire } from 'shared/src/contrib/aidbox';
import {
    questionnaireIdLoader,
    QuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { createPatient, createPractitionerRole, loginAdminUser } from 'src/setupTests';

const PATIENT_ADDITION_DATA = {
    name: [
        {
            given: ['Doe'],
            family: 'John',
        },
    ],
    birthDate: '2000-01-01',
};

const PRACTITIONER_ADDITION_DATA = {
    name: [{ family: 'Victorov', given: ['Victor', 'Victorovich'] }],
};

describe('createEncounter', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    test('should create encounter', async () => {
        const patient = await createPatient(PATIENT_ADDITION_DATA);
        const patientName = renderHumanName(patient.name![0]);

        const { practitionerRole, practitioner } = await createPractitionerRole(
            PRACTITIONER_ADDITION_DATA,
        );
        const practitionerName = renderHumanName(practitioner.name![0]);

        const createEncounterQR = ensure(
            await getFHIRResource<Questionnaire>({
                resourceType: 'Questionnaire',
                id: 'encounter-create',
            }),
        );

        const encounterDate = '2023-01-01';
        const encounterPeriodStartTime = '00:00:00';
        const encounterPeriodEndTime = '01:00:00';

        const formData: QuestionnaireResponseFormData = {
            context: {
                questionnaire: createEncounterQR,
                questionnaireResponse: {
                    resourceType: 'QuestionnaireResponse',
                    questionnaire: undefined,
                    status: 'in-progress',
                },
                launchContextParameters: [
                    {
                        name: 'Patient',
                        resource: patient,
                    },
                ],
            },
            formValues: {
                patientId: [
                    {
                        question: 'PatientId',
                        value: {
                            string: patient.id,
                        },
                        items: {},
                    },
                ],
                patientName: [
                    {
                        question: 'PatientName',
                        value: {
                            string: patientName,
                        },
                        items: {},
                    },
                ],
                'Time period': {
                    question: 'Time',
                    items: {
                        'start-time': [
                            {
                                value: {
                                    time: encounterPeriodStartTime,
                                },
                            },
                        ],
                        'end-time': [
                            {
                                value: {
                                    time: encounterPeriodEndTime,
                                },
                            },
                        ],
                    },
                },
                'practitioner-role': [
                    {
                        value: {
                            Reference: {
                                id: practitionerRole.id,
                                resourceType: 'PractitionerRole',
                                display: practitionerName,
                            },
                        },
                    },
                ],
                service: [
                    {
                        value: {
                            Coding: {
                                code: 'consultation',
                                system: 'http://fhir.org/guides/argonaut-scheduling/CodeSystem/visit-type',
                                display: 'The first appointment',
                            },
                        },
                    },
                ],
                date: [
                    {
                        value: {
                            date: encounterDate,
                        },
                    },
                ],
            },
        };

        const { result } = renderHook(() =>
            useQuestionnaireResponseForm({
                questionnaireLoader: questionnaireIdLoader('encounter-create'),
                launchContextParameters: [
                    {
                        name: 'Patient',
                        resource: patient,
                    },
                ],
            }),
        );

        let encountersBundle = ensure(await getFHIRResources<Encounter>('Encounter', {}));
        expect(encountersBundle.total).toBe(0);

        await act(async () => {
            await result.current.onSubmit(formData);
        });

        encountersBundle = ensure(await getFHIRResources<Encounter>('Encounter', {}));
        expect(encountersBundle.total).toBe(1);

        const createdEncounter = encountersBundle.entry![0]!.resource!;
        const createdEncounterStartDateTime = parseFHIRDateTime(createdEncounter.period!.start!);
        const createdEncounterEndDateTime = parseFHIRDateTime(createdEncounter.period!.end!);

        expect(
            createdEncounterStartDateTime.isSame(
                parseFHIRDateTime(`${encounterDate}T${encounterPeriodStartTime}`),
            ),
        ).toBeTruthy();
        expect(
            createdEncounterEndDateTime.isSame(
                parseFHIRDateTime(`${encounterDate}T${encounterPeriodEndTime}`),
            ),
        ).toBeTruthy();
    });
});
