import { act, renderHook, waitFor } from '@testing-library/react';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResource, getFHIRResources } from 'aidbox-react/lib/services/fhir';
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

        const createEncounterQRResponse = await getFHIRResource<Questionnaire>({
            resourceType: 'Questionnaire',
            id: 'encounter-create',
        });
        await waitFor(() => {
            expect(isSuccess(createEncounterQRResponse)).toBeTruthy();
        });

        if (isSuccess(createEncounterQRResponse)) {
            const formData: QuestionnaireResponseFormData = {
                context: {
                    questionnaire: {
                        launchContext: [
                            {
                                name: 'Patient',
                                type: 'Patient',
                            },
                        ],
                        name: 'encounter-create',
                        item: [
                            {
                                text: 'PatientId',
                                type: 'string',
                                hidden: true,
                                linkId: 'patientId',
                                initialExpression: {
                                    language: 'text/fhirpath',
                                    expression: '%Patient.id',
                                },
                            },
                            {
                                text: 'PatientName',
                                type: 'string',
                                linkId: 'patientName',
                                readOnly: true,
                                initialExpression: {
                                    language: 'text/fhirpath',
                                    expression:
                                        "%Patient.name.given[0] & ' ' & %Patient.name.family",
                                },
                            },
                            {
                                text: 'Practitioner',
                                type: 'choice',
                                linkId: 'practitioner-list',
                            },
                            {
                                text: 'Service',
                                type: 'choice',
                                linkId: 'service',
                                repeats: false,
                                answerOption: [
                                    {
                                        value: {
                                            Coding: {
                                                code: 'HH',
                                                system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                                                display: 'home health',
                                            },
                                        },
                                    },
                                    {
                                        value: {
                                            Coding: {
                                                code: 'AMB',
                                                system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                                                display: 'ambulatory',
                                            },
                                        },
                                    },
                                ],
                            },
                            {
                                text: 'Date',
                                type: 'date',
                                linkId: 'date',
                            },
                            {
                                item: [
                                    {
                                        type: 'time',
                                        linkId: 'start-time',
                                    },
                                    {
                                        type: 'time',
                                        linkId: 'end-time',
                                    },
                                ],
                                text: 'Time',
                                type: 'group',
                                linkId: 'Time period',
                                itemControl: {
                                    coding: [
                                        {
                                            code: 'time-range-picker',
                                        },
                                    ],
                                },
                            },
                        ],
                        mapping: [
                            {
                                resourceType: 'Mapping',
                                id: 'encounter-create',
                            },
                        ],
                        resourceType: 'Questionnaire',
                        title: 'Encounter create',
                        status: 'active',
                        assembledFrom: 'encounter-create',
                    },
                    questionnaireResponse: {
                        resourceType: 'QuestionnaireResponse',
                        questionnaire: undefined,
                        status: 'in-progress',
                        item: [
                            {
                                linkId: 'patientId',
                                text: 'PatientId',
                                answer: [
                                    {
                                        value: {
                                            string: patient.id,
                                        },
                                    },
                                ],
                            },
                            {
                                linkId: 'patientName',
                                text: 'PatientName',
                                answer: [
                                    {
                                        value: {
                                            string: patientName,
                                        },
                                    },
                                ],
                            },
                            {
                                linkId: 'practitioner-list',
                                text: 'Practitioner',
                            },
                            {
                                linkId: 'service',
                                text: 'Service',
                            },
                            {
                                linkId: 'date',
                                text: 'Date',
                            },
                            {
                                linkId: 'Time period',
                                text: 'Time',
                                item: [
                                    {
                                        linkId: 'start-time',
                                    },
                                    {
                                        linkId: 'end-time',
                                    },
                                ],
                            },
                        ],
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
                                        string: '00:00:00',
                                    },
                                },
                            ],
                            'end-time': [
                                {
                                    value: {
                                        string: '01:00:00',
                                    },
                                },
                            ],
                        },
                    },
                    'practitioner-list': [
                        {
                            value: {
                                Coding: {
                                    id: practitionerRole.id,
                                    code: 'PractitionerRole',
                                    display: practitionerName,
                                },
                            },
                        },
                    ],
                    service: [
                        {
                            value: {
                                Coding: {
                                    code: 'HH',
                                    system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                                    display: 'home health',
                                },
                            },
                        },
                    ],
                    date: [
                        {
                            value: {
                                date: '2023-01-01',
                            },
                        },
                    ],
                },
            };

            const { result } = renderHook(() =>
                useQuestionnaireResponseForm({
                    questionnaireLoader: questionnaireIdLoader('encounter-create'),
                }),
            );

            let encountersResponse = await getFHIRResources<Encounter>('Encounter', {});
            await waitFor(() => {
                expect(isSuccess(encountersResponse)).toBeTruthy();
            });
            if (isSuccess(encountersResponse)) {
                expect(encountersResponse.data.total).toBe(0);
            }

            act(() => {
                result.current.onSubmit(formData);
            });

            encountersResponse = await getFHIRResources<Encounter>('Encounter', {});
            await waitFor(() => {
                expect(isSuccess(encountersResponse)).toBeTruthy();
            });
            if (isSuccess(encountersResponse)) {
                expect(encountersResponse.data.total).toBe(1);
            }
        }
    });
});
