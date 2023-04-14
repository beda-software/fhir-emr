import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';
import { QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { service } from 'aidbox-react/lib/services/service';
import { ensure } from 'aidbox-react/lib/utils/tests';

import {
    Questionnaire as AidboxQuestionnaire,
    QuestionnaireResponse as AidboxQuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

import { loginAdminUser } from 'src/setupTests';
import { toFHIRformat, toFirstClassExtension } from 'src/utils/fce';

const notWorkingQuestionnaires = [
    'edit-appointment',
    'encounter-create-from-appointment',
    'new-appointment',
    'federated-identity-signin',
];

describe('Questionanire and QuestionnaireResponses transformation', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });
    test.skip('Each Questionnaires should convert to fce and back to fhir', async () => {
        const questionnaires = extractBundleResources(
            ensure(await getFHIRResources<AidboxQuestionnaire>('Questionnaire', { _count: 9999 })),
        ).Questionnaire;
        for (let q of questionnaires) {
            console.log('Conversion', q.id);
            if (!notWorkingQuestionnaires.includes(q.id)) {
                const fhirQuestionnaire = ensure(
                    await service<FHIRQuestionnaire>({
                        url: `/fhir/Questionnaire/${q.id}`,
                    }),
                );
                const fceQuestionnaire = toFirstClassExtension(fhirQuestionnaire);
                expect(fceQuestionnaire).toStrictEqual(q);
                const fhirQuestionnaireConverted = toFHIRformat(fceQuestionnaire!);
                expect(fhirQuestionnaireConverted).toStrictEqual(fhirQuestionnaire);
            }
        }
    });
    test('Each FHIR QuestionnaireResponse should convert to FCE', async () => {
        expect(toFirstClassExtension(practitioner_fhir_QuestionnaireResponse)).toStrictEqual(
            practitioner_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(patient_fhir_QuestionnaireResponse)).toStrictEqual(
            patient_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(allergies_fhir_QuestionnaireResponse)).toStrictEqual(
            allergies_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(gad7_fhir_QuestionnaireResponse)).toStrictEqual(
            gad7_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(medication_fhir_QuestionnaireResponse)).toStrictEqual(
            medication_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(physicalexam_fhir_QuestionnaireResponse)).toStrictEqual(
            physicalexam_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(reviewofsystems_fhir_QuestionnaireResponse)).toStrictEqual(
            reviewofsystems_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(vitals_fhir_QuestionnaireResponse)).toStrictEqual(
            vitals_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(phq2phq9_fhir_QuestionnaireResponse)).toStrictEqual(
            phq2phq9_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(immunization_fhir_QuestionnaireResponse)).toStrictEqual(
            immunization_aidbox_QuestionnaireResponse,
        );
        expect(toFirstClassExtension(cardiology_fhir_QuestionnaireResponse)).toStrictEqual(
            cardiology_aidbox_QuestionnaireResponse,
        );
        expect(
            toFirstClassExtension(allergies_inprogress_fhir_QuestionnaireResponse),
        ).toStrictEqual(allergies_inprogress_aidbox_QuestionnaireResponse);
        expect(toFirstClassExtension(newappointment_fhir_QuestionnaireResponse)).toStrictEqual(
            newappointment_aidbox_QuestionnaireResponse,
        );
    });
    test('Each FCE QuestionnaireResponse should convert to FHIR', async () => {
        expect(toFHIRformat(practitioner_aidbox_QuestionnaireResponse)).toStrictEqual(
            practitioner_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(patient_aidbox_QuestionnaireResponse)).toStrictEqual(
            patient_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(allergies_aidbox_QuestionnaireResponse)).toStrictEqual(
            allergies_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(gad7_aidbox_QuestionnaireResponse)).toStrictEqual(
            gad7_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(medication_aidbox_QuestionnaireResponse)).toStrictEqual(
            medication_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(physicalexam_aidbox_QuestionnaireResponse)).toStrictEqual(
            physicalexam_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(reviewofsystems_aidbox_QuestionnaireResponse)).toStrictEqual(
            reviewofsystems_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(vitals_aidbox_QuestionnaireResponse)).toStrictEqual(
            vitals_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(phq2phq9_aidbox_QuestionnaireResponse)).toStrictEqual(
            phq2phq9_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(immunization_aidbox_QuestionnaireResponse)).toStrictEqual(
            immunization_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(cardiology_aidbox_QuestionnaireResponse)).toStrictEqual(
            cardiology_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(allergies_inprogress_aidbox_QuestionnaireResponse)).toStrictEqual(
            allergies_inprogress_fhir_QuestionnaireResponse,
        );
        expect(toFHIRformat(newappointment_aidbox_QuestionnaireResponse)).toStrictEqual(
            newappointment_fhir_QuestionnaireResponse,
        );
    });
});

const practitioner_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-05T06:09:09Z',
        id: 'cedd0c3e-be1a-4c1b-92af-351ed76fe41e',
        item: [
            {
                answer: [
                    {
                        valueString: 'Patel',
                    },
                ],
                linkId: 'last-name',
            },
            {
                answer: [
                    {
                        valueString: 'Sanjay',
                    },
                ],
                linkId: 'first-name',
            },
            {
                answer: [
                    {
                        valueString: 'Kumar',
                    },
                ],
                linkId: 'middle-name',
            },
            {
                answer: [
                    {
                        valueCoding: {
                            code: '394579002',
                            display: 'Cardiology',
                            system: 'http://snomed.info/sct',
                        },
                    },
                ],
                linkId: 'specialty',
            },
        ],
        meta: {
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-05T06:09:10.640955Z',
                },
            ],
            lastUpdated: '2023-04-05T06:09:10.640955Z',
            versionId: '20415',
        },
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
    }),
);

const practitioner_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-05T06:09:09Z',
        id: 'cedd0c3e-be1a-4c1b-92af-351ed76fe41e',
        item: [
            {
                answer: [
                    {
                        value: {
                            string: 'Patel',
                        },
                    },
                ],
                linkId: 'last-name',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Sanjay',
                        },
                    },
                ],
                linkId: 'first-name',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Kumar',
                        },
                    },
                ],
                linkId: 'middle-name',
            },
            {
                answer: [
                    {
                        value: {
                            Coding: {
                                code: '394579002',
                                display: 'Cardiology',
                                system: 'http://snomed.info/sct',
                            },
                        },
                    },
                ],
                linkId: 'specialty',
            },
        ],
        meta: {
            createdAt: '2023-04-05T06:09:10.640955Z',
            lastUpdated: '2023-04-05T06:09:10.640955Z',
            versionId: '20415',
        },
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
    }),
);

const patient_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-05T06:03:19Z',
        id: '24306b57-b463-4e39-807f-e715a80bbe5f',
        item: [
            {
                answer: [
                    {
                        value: {},
                    },
                ],
                linkId: 'patient-id',
            },
            {
                answer: [
                    {
                        valueString: 'Nguyen',
                    },
                ],
                linkId: 'last-name',
            },
            {
                answer: [
                    {
                        valueString: 'Emily',
                    },
                ],
                linkId: 'first-name',
            },
            {
                answer: [
                    {
                        valueString: 'Marie',
                    },
                ],
                linkId: 'middle-name',
            },
            {
                answer: [
                    {
                        valueDate: '1991-12-29',
                    },
                ],
                linkId: 'birth-date',
            },
            {
                answer: [
                    {
                        valueString: 'female',
                    },
                ],
                linkId: 'gender',
            },
            {
                answer: [
                    {
                        valueString: '123-45-6789',
                    },
                ],
                linkId: 'ssn',
            },
            {
                answer: [
                    {
                        valueString: '15551234567',
                    },
                ],
                linkId: 'mobile',
            },
        ],
        meta: {
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-05T06:03:21.353895Z',
                },
            ],
            lastUpdated: '2023-04-05T06:03:21.353895Z',
            versionId: '20412',
        },
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
    }),
);

const patient_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-05T06:03:19Z',
        id: '24306b57-b463-4e39-807f-e715a80bbe5f',
        item: [
            {
                answer: [
                    {
                        value: {},
                    },
                ],
                linkId: 'patient-id',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Nguyen',
                        },
                    },
                ],
                linkId: 'last-name',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily',
                        },
                    },
                ],
                linkId: 'first-name',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Marie',
                        },
                    },
                ],
                linkId: 'middle-name',
            },
            {
                answer: [
                    {
                        value: {
                            date: '1991-12-29',
                        },
                    },
                ],
                linkId: 'birth-date',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'female',
                        },
                    },
                ],
                linkId: 'gender',
            },
            {
                answer: [
                    {
                        value: {
                            string: '123-45-6789',
                        },
                    },
                ],
                linkId: 'ssn',
            },
            {
                answer: [
                    {
                        value: {
                            string: '15551234567',
                        },
                    },
                ],
                linkId: 'mobile',
            },
        ],
        meta: {
            createdAt: '2023-04-05T06:03:21.353895Z',
            lastUpdated: '2023-04-05T06:03:21.353895Z',
            versionId: '20412',
        },
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
    }),
);

const allergies_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-05T06:27:57Z',
        id: 'cf6d9d4b-bfcd-463f-9d26-b6769c2a3fc3',
        item: [
            {
                answer: [
                    {
                        valueString: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        valueString: 'Emily Nguyen',
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        valueReference: {
                            display: 'Sanjay Patel - Cardiology',
                            reference: 'PractitionerRole/429e6a55-8a64-4ede-ad12-1206522253eb',
                            resource: {
                                healthcareService: [
                                    {
                                        display: 'The first appointment',
                                        id: 'consultation',
                                        resourceType: 'HealthcareService',
                                    },
                                    {
                                        display: 'A follow up visit',
                                        id: 'follow-up',
                                        resourceType: 'HealthcareService',
                                    },
                                ],
                                id: '429e6a55-8a64-4ede-ad12-1206522253eb',
                                meta: {
                                    createdAt: '2023-04-05T06:09:11.092359Z',
                                    lastUpdated: '2023-04-05T06:09:11.092359Z',
                                    versionId: '20418',
                                },
                                practitioner: {
                                    id: '42e9bdc0-4fe6-4b8d-a6a5-fcb68f1fe836',
                                    resource: {
                                        id: '42e9bdc0-4fe6-4b8d-a6a5-fcb68f1fe836',
                                        meta: {
                                            createdAt: '2023-04-05T06:09:11.092359Z',
                                            lastUpdated: '2023-04-05T06:09:11.092359Z',
                                            versionId: '20416',
                                        },
                                        name: [
                                            {
                                                family: 'Patel',
                                                given: ['Sanjay', 'Kumar'],
                                            },
                                        ],
                                        resourceType: 'Practitioner',
                                    },
                                    resourceType: 'Practitioner',
                                },
                                resourceType: 'PractitionerRole',
                                specialty: [
                                    {
                                        coding: [
                                            {
                                                code: '394579002',
                                                display: 'Cardiology',
                                                system: 'http://snomed.info/sct',
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
                linkId: 'practitioner-role',
            },
            {
                answer: [
                    {
                        valueCoding: {
                            code: 'consultation',
                            display: 'The first appointment',
                            system: 'http://fhir.org/guides/argonaut-scheduling/CodeSystem/visit-type',
                        },
                    },
                ],
                linkId: 'service',
            },
            {
                answer: [
                    {
                        valueDate: '2023-04-26',
                    },
                ],
                linkId: 'date',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                valueTime: '15:00:00',
                            },
                        ],
                        linkId: 'start-time',
                    },
                    {
                        answer: [
                            {
                                valueTime: '16:00:00',
                            },
                        ],
                        linkId: 'end-time',
                    },
                ],
                linkId: 'Time period',
            },
        ],
        meta: {
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-05T06:27:58.499391Z',
                },
            ],
            lastUpdated: '2023-04-05T06:27:58.499391Z',
            versionId: '20420',
        },
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
    }),
);

const allergies_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-05T06:27:57Z',
        id: 'cf6d9d4b-bfcd-463f-9d26-b6769c2a3fc3',
        item: [
            {
                answer: [
                    {
                        value: {
                            string: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                        },
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily Nguyen',
                        },
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        value: {
                            Reference: {
                                display: 'Sanjay Patel - Cardiology',
                                id: '429e6a55-8a64-4ede-ad12-1206522253eb',
                                resource: {
                                    healthcareService: [
                                        {
                                            display: 'The first appointment',
                                            id: 'consultation',
                                            resourceType: 'HealthcareService',
                                        },
                                        {
                                            display: 'A follow up visit',
                                            id: 'follow-up',
                                            resourceType: 'HealthcareService',
                                        },
                                    ],
                                    id: '429e6a55-8a64-4ede-ad12-1206522253eb',
                                    meta: {
                                        createdAt: '2023-04-05T06:09:11.092359Z',
                                        lastUpdated: '2023-04-05T06:09:11.092359Z',
                                        versionId: '20418',
                                    },
                                    practitioner: {
                                        id: '42e9bdc0-4fe6-4b8d-a6a5-fcb68f1fe836',
                                        resource: {
                                            id: '42e9bdc0-4fe6-4b8d-a6a5-fcb68f1fe836',
                                            meta: {
                                                createdAt: '2023-04-05T06:09:11.092359Z',
                                                lastUpdated: '2023-04-05T06:09:11.092359Z',
                                                versionId: '20416',
                                            },
                                            name: [
                                                {
                                                    family: 'Patel',
                                                    given: ['Sanjay', 'Kumar'],
                                                },
                                            ],
                                            resourceType: 'Practitioner',
                                        },
                                        resourceType: 'Practitioner',
                                    },
                                    resourceType: 'PractitionerRole',
                                    specialty: [
                                        {
                                            coding: [
                                                {
                                                    code: '394579002',
                                                    display: 'Cardiology',
                                                    system: 'http://snomed.info/sct',
                                                },
                                            ],
                                        },
                                    ],
                                },
                                resourceType: 'PractitionerRole',
                            },
                        },
                    },
                ],
                linkId: 'practitioner-role',
            },
            {
                answer: [
                    {
                        value: {
                            Coding: {
                                code: 'consultation',
                                display: 'The first appointment',
                                system: 'http://fhir.org/guides/argonaut-scheduling/CodeSystem/visit-type',
                            },
                        },
                    },
                ],
                linkId: 'service',
            },
            {
                answer: [
                    {
                        value: {
                            date: '2023-04-26',
                        },
                    },
                ],
                linkId: 'date',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                value: {
                                    time: '15:00:00',
                                },
                            },
                        ],
                        linkId: 'start-time',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    time: '16:00:00',
                                },
                            },
                        ],
                        linkId: 'end-time',
                    },
                ],
                linkId: 'Time period',
            },
        ],
        meta: {
            createdAt: '2023-04-05T06:27:58.499391Z',
            lastUpdated: '2023-04-05T06:27:58.499391Z',
            versionId: '20420',
        },
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
    }),
);

const gad7_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'gad-7',
        meta: {
            lastUpdated: '2023-04-06T01:29:05.681893Z',
            versionId: '20442',
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T01:28:53.793848Z',
                },
            ],
        },
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        item: [
            {
                answer: [
                    {
                        valueDateTime: '2023-04-06T01:28:52+00:00',
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        valueString: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        valueString: 'Emily Nguyen',
                    },
                ],
                linkId: 'patientName',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6569-3',
                                    system: 'http://loinc.org',
                                    display: 'Several days',
                                },
                            },
                        ],
                        linkId: '69725-0',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6570-1',
                                    system: 'http://loinc.org',
                                    display: 'More than half the days',
                                },
                            },
                        ],
                        linkId: '68509-9',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6568-5',
                                    system: 'http://loinc.org',
                                    display: 'Not at all',
                                },
                            },
                        ],
                        linkId: '69733-4',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6571-9',
                                    system: 'http://loinc.org',
                                    display: 'Nearly every day',
                                },
                            },
                        ],
                        linkId: '69734-2',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6570-1',
                                    system: 'http://loinc.org',
                                    display: 'More than half the days',
                                },
                            },
                        ],
                        linkId: '69735-9',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6569-3',
                                    system: 'http://loinc.org',
                                    display: 'Several days',
                                },
                            },
                        ],
                        linkId: '69689-8',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6568-5',
                                    system: 'http://loinc.org',
                                    display: 'Not at all',
                                },
                            },
                        ],
                        linkId: '69736-7',
                    },
                    {
                        answer: [
                            {
                                valueInteger: 9,
                            },
                        ],
                        linkId: 'anxiety-score',
                    },
                ],
                linkId: 'gad-7',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'completed',
        id: 'a00b8309-f74f-462c-a7e4-64852d5bf707',
        authored: '2023-04-06T01:29:05Z',
    }),
);

const gad7_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'gad-7',
        meta: {
            lastUpdated: '2023-04-06T01:29:05.681893Z',
            createdAt: '2023-04-06T01:28:53.793848Z',
            versionId: '20442',
        },
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        item: [
            {
                answer: [
                    {
                        value: {
                            dateTime: '2023-04-06T01:28:52+00:00',
                        },
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        value: {
                            string: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                        },
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily Nguyen',
                        },
                    },
                ],
                linkId: 'patientName',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6569-3',
                                        system: 'http://loinc.org',
                                        display: 'Several days',
                                    },
                                },
                            },
                        ],
                        linkId: '69725-0',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6570-1',
                                        system: 'http://loinc.org',
                                        display: 'More than half the days',
                                    },
                                },
                            },
                        ],
                        linkId: '68509-9',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6568-5',
                                        system: 'http://loinc.org',
                                        display: 'Not at all',
                                    },
                                },
                            },
                        ],
                        linkId: '69733-4',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6571-9',
                                        system: 'http://loinc.org',
                                        display: 'Nearly every day',
                                    },
                                },
                            },
                        ],
                        linkId: '69734-2',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6570-1',
                                        system: 'http://loinc.org',
                                        display: 'More than half the days',
                                    },
                                },
                            },
                        ],
                        linkId: '69735-9',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6569-3',
                                        system: 'http://loinc.org',
                                        display: 'Several days',
                                    },
                                },
                            },
                        ],
                        linkId: '69689-8',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6568-5',
                                        system: 'http://loinc.org',
                                        display: 'Not at all',
                                    },
                                },
                            },
                        ],
                        linkId: '69736-7',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    integer: 9,
                                },
                            },
                        ],
                        linkId: 'anxiety-score',
                    },
                ],
                linkId: 'gad-7',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'completed',
        id: 'a00b8309-f74f-462c-a7e4-64852d5bf707',
        authored: '2023-04-06T01:29:05Z',
    }),
);

const medication_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'medication',
        meta: {
            lastUpdated: '2023-04-06T01:59:42.145206Z',
            versionId: '20458',
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T01:59:02.311377Z',
                },
            ],
        },
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        item: [
            {
                answer: [
                    {
                        valueDateTime: '2023-04-06T01:59:00+00:00',
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        valueString: 'e133b999-9e91-4ebd-967e-450bad770682',
                    },
                ],
                linkId: 'encounterId',
            },
            {
                answer: [
                    {
                        valueString: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        valueString: 'Emily Nguyen',
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        valueCoding: {
                            code: '261000',
                            system: 'http://snomed.info/sct',
                            display: 'Codeine phosphate',
                        },
                    },
                ],
                linkId: 'medication',
            },
            {
                answer: [
                    {
                        valueString: '25 or 20',
                    },
                ],
                linkId: 'dosage',
            },
            {
                answer: [
                    {
                        valueDate: '2023-04-10',
                    },
                ],
                linkId: 'start-date',
            },
            {
                answer: [
                    {
                        valueDate: '2023-04-17',
                    },
                ],
                linkId: 'stop-date',
            },
            {
                answer: [
                    {
                        valueString: 'nothing',
                    },
                ],
                linkId: 'notes',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'completed',
        id: '3d077aed-ccd4-43d4-843e-0e2224e7571e',
        authored: '2023-04-06T01:59:41Z',
    }),
);

const medication_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'medication',
        meta: {
            lastUpdated: '2023-04-06T01:59:42.145206Z',
            createdAt: '2023-04-06T01:59:02.311377Z',
            versionId: '20458',
        },
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        item: [
            {
                answer: [
                    {
                        value: {
                            dateTime: '2023-04-06T01:59:00+00:00',
                        },
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'e133b999-9e91-4ebd-967e-450bad770682',
                        },
                    },
                ],
                linkId: 'encounterId',
            },
            {
                answer: [
                    {
                        value: {
                            string: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                        },
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily Nguyen',
                        },
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        value: {
                            Coding: {
                                code: '261000',
                                system: 'http://snomed.info/sct',
                                display: 'Codeine phosphate',
                            },
                        },
                    },
                ],
                linkId: 'medication',
            },
            {
                answer: [
                    {
                        value: {
                            string: '25 or 20',
                        },
                    },
                ],
                linkId: 'dosage',
            },
            {
                answer: [
                    {
                        value: {
                            date: '2023-04-10',
                        },
                    },
                ],
                linkId: 'start-date',
            },
            {
                answer: [
                    {
                        value: {
                            date: '2023-04-17',
                        },
                    },
                ],
                linkId: 'stop-date',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'nothing',
                        },
                    },
                ],
                linkId: 'notes',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'completed',
        id: '3d077aed-ccd4-43d4-843e-0e2224e7571e',
        authored: '2023-04-06T01:59:41Z',
    }),
);

const physicalexam_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'physical-exam',
        meta: {
            lastUpdated: '2023-04-06T02:05:52.434771Z',
            versionId: '20470',
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T02:05:32.668369Z',
                },
            ],
        },
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        item: [
            {
                item: [
                    {
                        answer: [
                            {
                                valueString:
                                    'Well nourished, well developed, awake and alert, resting comfortably in no acute distress, cooperative on exam',
                            },
                        ],
                        linkId: 'general',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'NCAT, PERRL, normal conjunctivae, nonicteric sclerae, bilateral EAC/TM clear, no nasal discharge, OP clear, moist mucous membranes',
                            },
                        ],
                        linkId: 'heent',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'Supple, normal ROM, no lymphadenopathy/masses, nontender',
                            },
                        ],
                        linkId: 'neck',
                    },
                    {
                        answer: [
                            {
                                valueString: 'RRR, normal S1/S2, no murmurs/gallops/rub',
                            },
                        ],
                        linkId: 'cardiovascular',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'No respiratory distress, lungs CTAB: no rales, rhonchi, or wheeze',
                            },
                        ],
                        linkId: 'pulmonary',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'Soft and non-tender with no guarding or rebound; +BS normoactive, no tympany on auscultation',
                            },
                        ],
                        linkId: 'abdominal',
                    },
                    {
                        answer: [
                            {
                                valueString: 'Normal ROM of UE and LE, normal bulk and tone,',
                            },
                        ],
                        linkId: 'musculoskeletal',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'Pulses intact with normal cap refill, no LE pitting edema or calf tenderness',
                            },
                        ],
                        linkId: 'extremities',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'AAOx3, converses normally. CN II - XII grossly intact. Gait and coordination intact. 5+ BL UE/LE strength, no gross motor or sensory defects',
                            },
                        ],
                        linkId: 'neurologic',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'Normal mood and affect. Judgement/competence is appropriate',
                            },
                        ],
                        linkId: 'psychiatric',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'Warm, dry, and intact. No rashes, dermatoses, petechiae, or lesions',
                            },
                        ],
                        linkId: 'skin',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'Normal sensation bilaterally on soles of feet with 10g monofilament',
                            },
                        ],
                        linkId: 'monofilament',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'The chest wall is symmetric, without deformity, and is atraumatic in appearance',
                            },
                        ],
                        linkId: 'chest',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'External genitalia without erythema, exudate or discharge',
                            },
                        ],
                        linkId: 'genitourinary-female',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'Normal external anus and normal tone. No palpable masses, normal mucosa, brown stool. Hemoccult negative',
                            },
                        ],
                        linkId: 'rectal',
                    },
                    {
                        answer: [
                            {
                                valueString:
                                    'No enlarged lymph nodes of occipital, pre- and postauricular, submandibular, anterior or posterior cervical, or supraclavicular identified',
                            },
                        ],
                        linkId: 'lymphatic',
                    },
                ],
                linkId: 'physical-exam-group',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'completed',
        id: '288fd914-b836-47dd-863a-e7d86a923f28',
        authored: '2023-04-06T02:05:51Z',
    }),
);

const physicalexam_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'physical-exam',
        meta: {
            lastUpdated: '2023-04-06T02:05:52.434771Z',
            createdAt: '2023-04-06T02:05:32.668369Z',
            versionId: '20470',
        },
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        item: [
            {
                item: [
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Well nourished, well developed, awake and alert, resting comfortably in no acute distress, cooperative on exam',
                                },
                            },
                        ],
                        linkId: 'general',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'NCAT, PERRL, normal conjunctivae, nonicteric sclerae, bilateral EAC/TM clear, no nasal discharge, OP clear, moist mucous membranes',
                                },
                            },
                        ],
                        linkId: 'heent',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Supple, normal ROM, no lymphadenopathy/masses, nontender',
                                },
                            },
                        ],
                        linkId: 'neck',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'RRR, normal S1/S2, no murmurs/gallops/rub',
                                },
                            },
                        ],
                        linkId: 'cardiovascular',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'No respiratory distress, lungs CTAB: no rales, rhonchi, or wheeze',
                                },
                            },
                        ],
                        linkId: 'pulmonary',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Soft and non-tender with no guarding or rebound; +BS normoactive, no tympany on auscultation',
                                },
                            },
                        ],
                        linkId: 'abdominal',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Normal ROM of UE and LE, normal bulk and tone,',
                                },
                            },
                        ],
                        linkId: 'musculoskeletal',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Pulses intact with normal cap refill, no LE pitting edema or calf tenderness',
                                },
                            },
                        ],
                        linkId: 'extremities',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'AAOx3, converses normally. CN II - XII grossly intact. Gait and coordination intact. 5+ BL UE/LE strength, no gross motor or sensory defects',
                                },
                            },
                        ],
                        linkId: 'neurologic',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Normal mood and affect. Judgement/competence is appropriate',
                                },
                            },
                        ],
                        linkId: 'psychiatric',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Warm, dry, and intact. No rashes, dermatoses, petechiae, or lesions',
                                },
                            },
                        ],
                        linkId: 'skin',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Normal sensation bilaterally on soles of feet with 10g monofilament',
                                },
                            },
                        ],
                        linkId: 'monofilament',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'The chest wall is symmetric, without deformity, and is atraumatic in appearance',
                                },
                            },
                        ],
                        linkId: 'chest',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'External genitalia without erythema, exudate or discharge',
                                },
                            },
                        ],
                        linkId: 'genitourinary-female',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'Normal external anus and normal tone. No palpable masses, normal mucosa, brown stool. Hemoccult negative',
                                },
                            },
                        ],
                        linkId: 'rectal',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'No enlarged lymph nodes of occipital, pre- and postauricular, submandibular, anterior or posterior cervical, or supraclavicular identified',
                                },
                            },
                        ],
                        linkId: 'lymphatic',
                    },
                ],
                linkId: 'physical-exam-group',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'completed',
        id: '288fd914-b836-47dd-863a-e7d86a923f28',
        authored: '2023-04-06T02:05:51Z',
    }),
);

const reviewofsystems_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-06T02:11:08Z',
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        id: 'd575fe05-9db2-4df8-b131-48bb5d27509d',
        item: [
            {
                answer: [
                    {
                        valueBoolean: true,
                    },
                ],
                linkId: 'provider-viewed-confirmation',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'general',
                    },
                    {
                        answer: [
                            {
                                valueBoolean: true,
                            },
                        ],
                        linkId: 'heent',
                    },
                    {
                        answer: [
                            {
                                valueString: 'heent',
                            },
                        ],
                        linkId: 'heent-comment',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'cardiovascular',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'respiratory',
                    },
                    {
                        answer: [
                            {
                                valueBoolean: true,
                            },
                        ],
                        linkId: 'gastrointestinal',
                    },
                    {
                        answer: [
                            {
                                valueString: 'gastrointestinal',
                            },
                        ],
                        linkId: 'gastrointestinal-comment',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'genitourinary',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'musculoskeletal',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'neurologic',
                    },
                    {
                        answer: [
                            {
                                valueBoolean: true,
                            },
                        ],
                        linkId: 'psychiatric',
                    },
                    {
                        answer: [
                            {
                                valueString: 'psychiatric',
                            },
                        ],
                        linkId: 'psychiatric-comment',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'skin',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'other',
                    },
                ],
                linkId: 'abnormal-systems-group',
            },
        ],
        meta: {
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T02:10:37.718483Z',
                },
            ],
            lastUpdated: '2023-04-06T02:11:09.776717Z',
            versionId: '20480',
        },
        questionnaire: 'review-of-systems',
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'completed',
    }),
);

const reviewofsystems_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-06T02:11:08Z',
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        id: 'd575fe05-9db2-4df8-b131-48bb5d27509d',
        item: [
            {
                answer: [
                    {
                        value: {
                            boolean: true,
                        },
                    },
                ],
                linkId: 'provider-viewed-confirmation',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'general',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    boolean: true,
                                },
                            },
                        ],
                        linkId: 'heent',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'heent',
                                },
                            },
                        ],
                        linkId: 'heent-comment',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'cardiovascular',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'respiratory',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    boolean: true,
                                },
                            },
                        ],
                        linkId: 'gastrointestinal',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'gastrointestinal',
                                },
                            },
                        ],
                        linkId: 'gastrointestinal-comment',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'genitourinary',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'musculoskeletal',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'neurologic',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    boolean: true,
                                },
                            },
                        ],
                        linkId: 'psychiatric',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    string: 'psychiatric',
                                },
                            },
                        ],
                        linkId: 'psychiatric-comment',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'skin',
                    },
                    {
                        answer: [
                            {
                                value: {},
                            },
                        ],
                        linkId: 'other',
                    },
                ],
                linkId: 'abnormal-systems-group',
            },
        ],
        meta: {
            createdAt: '2023-04-06T02:10:37.718483Z',
            lastUpdated: '2023-04-06T02:11:09.776717Z',
            versionId: '20480',
        },
        questionnaire: 'review-of-systems',
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'completed',
    }),
);

const vitals_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'vitals',
        meta: {
            lastUpdated: '2023-04-06T02:20:25.903562Z',
            versionId: '20492',
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T02:19:51.712237Z',
                },
            ],
        },
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        item: [
            {
                answer: [
                    {
                        valueString: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        valueString: 'Emily Nguyen',
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        valueInteger: 180,
                    },
                ],
                linkId: 'height',
            },
            {
                answer: [
                    {
                        valueInteger: 80,
                    },
                ],
                linkId: 'weight',
            },
            {
                answer: [
                    {
                        valueInteger: 36,
                    },
                ],
                linkId: 'temperature',
            },
            {
                answer: [
                    {
                        valueInteger: 56,
                    },
                ],
                linkId: 'oxygen-saturation',
            },
            {
                answer: [
                    {
                        valueInteger: 100,
                    },
                ],
                linkId: 'pulse-rate',
            },
            {
                answer: [
                    {
                        valueInteger: 50,
                    },
                ],
                linkId: 'respiratory-rate',
            },
            {
                item: [
                    {
                        item: [
                            {
                                answer: [
                                    {
                                        valueInteger: 45,
                                    },
                                ],
                                linkId: 'blood-pressure-systolic',
                            },
                            {
                                answer: [
                                    {
                                        valueInteger: 67,
                                    },
                                ],
                                linkId: 'blood-pressure-diastolic',
                            },
                        ],
                        linkId: 'blood-pressure-systolic-diastolic',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'sitting',
                                    display: 'Sitting',
                                },
                            },
                        ],
                        linkId: 'blood-pressure-positions',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'biceps-left',
                                    display: 'Biceps left',
                                },
                            },
                        ],
                        linkId: 'blood-pressure-arm',
                    },
                ],
                linkId: 'blood-pressure',
            },
            {
                answer: [
                    {
                        valueInteger: 24.69,
                    },
                ],
                linkId: 'bmi',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'completed',
        id: 'a583cc11-99c6-4719-acab-cb3fb72f5078',
        authored: '2023-04-06T02:20:25Z',
    }),
);

const vitals_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'vitals',
        meta: {
            lastUpdated: '2023-04-06T02:20:25.903562Z',
            createdAt: '2023-04-06T02:19:51.712237Z',
            versionId: '20492',
        },
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        item: [
            {
                answer: [
                    {
                        value: {
                            string: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                        },
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily Nguyen',
                        },
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        value: {
                            integer: 180,
                        },
                    },
                ],
                linkId: 'height',
            },
            {
                answer: [
                    {
                        value: {
                            integer: 80,
                        },
                    },
                ],
                linkId: 'weight',
            },
            {
                answer: [
                    {
                        value: {
                            integer: 36,
                        },
                    },
                ],
                linkId: 'temperature',
            },
            {
                answer: [
                    {
                        value: {
                            integer: 56,
                        },
                    },
                ],
                linkId: 'oxygen-saturation',
            },
            {
                answer: [
                    {
                        value: {
                            integer: 100,
                        },
                    },
                ],
                linkId: 'pulse-rate',
            },
            {
                answer: [
                    {
                        value: {
                            integer: 50,
                        },
                    },
                ],
                linkId: 'respiratory-rate',
            },
            {
                item: [
                    {
                        item: [
                            {
                                answer: [
                                    {
                                        value: {
                                            integer: 45,
                                        },
                                    },
                                ],
                                linkId: 'blood-pressure-systolic',
                            },
                            {
                                answer: [
                                    {
                                        value: {
                                            integer: 67,
                                        },
                                    },
                                ],
                                linkId: 'blood-pressure-diastolic',
                            },
                        ],
                        linkId: 'blood-pressure-systolic-diastolic',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'sitting',
                                        display: 'Sitting',
                                    },
                                },
                            },
                        ],
                        linkId: 'blood-pressure-positions',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'biceps-left',
                                        display: 'Biceps left',
                                    },
                                },
                            },
                        ],
                        linkId: 'blood-pressure-arm',
                    },
                ],
                linkId: 'blood-pressure',
            },
            {
                answer: [
                    {
                        value: {
                            integer: 24.69,
                        },
                    },
                ],
                linkId: 'bmi',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'completed',
        id: 'a583cc11-99c6-4719-acab-cb3fb72f5078',
        authored: '2023-04-06T02:20:25Z',
    }),
);

const phq2phq9_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-06T02:33:05Z',
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        id: '846558b9-4c03-4af6-a258-62b0390633e2',
        item: [
            {
                answer: [
                    {
                        valueDateTime: '2023-04-06T02:32:40+00:00',
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        valueString: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        valueString: 'Emily Nguyen',
                    },
                ],
                linkId: 'patientName',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6568-5',
                                    display: 'Not at all',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44250-9',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6569-3',
                                    display: 'Several days',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44255-8',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6570-1',
                                    display: 'More than half the days',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44259-0',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6571-9',
                                    display: 'Nearly every day',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44254-1',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6570-1',
                                    display: 'More than half the days',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44251-7',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6569-3',
                                    display: 'Several days',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44258-2',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6568-5',
                                    display: 'Not at all',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44252-5',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6569-3',
                                    display: 'Several days',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44253-3',
                    },
                    {
                        answer: [
                            {
                                valueCoding: {
                                    code: 'LA6570-1',
                                    display: 'More than half the days',
                                    system: 'http://loinc.org',
                                },
                            },
                        ],
                        linkId: '44260-8',
                    },
                    {
                        answer: [
                            {
                                valueInteger: 12,
                            },
                        ],
                        linkId: 'phq9-total-score',
                    },
                ],
                linkId: 'phq2phq9',
            },
        ],
        meta: {
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T02:32:41.569773Z',
                },
            ],
            lastUpdated: '2023-04-06T02:33:06.758734Z',
            versionId: '20508',
        },
        questionnaire: 'phq2phq9',
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'completed',
    }),
);

const phq2phq9_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-06T02:33:05Z',
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        id: '846558b9-4c03-4af6-a258-62b0390633e2',
        item: [
            {
                answer: [
                    {
                        value: {
                            dateTime: '2023-04-06T02:32:40+00:00',
                        },
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        value: {
                            string: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                        },
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily Nguyen',
                        },
                    },
                ],
                linkId: 'patientName',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6568-5',
                                        display: 'Not at all',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44250-9',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6569-3',
                                        display: 'Several days',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44255-8',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6570-1',
                                        display: 'More than half the days',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44259-0',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6571-9',
                                        display: 'Nearly every day',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44254-1',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6570-1',
                                        display: 'More than half the days',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44251-7',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6569-3',
                                        display: 'Several days',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44258-2',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6568-5',
                                        display: 'Not at all',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44252-5',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6569-3',
                                        display: 'Several days',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44253-3',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    Coding: {
                                        code: 'LA6570-1',
                                        display: 'More than half the days',
                                        system: 'http://loinc.org',
                                    },
                                },
                            },
                        ],
                        linkId: '44260-8',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    integer: 12,
                                },
                            },
                        ],
                        linkId: 'phq9-total-score',
                    },
                ],
                linkId: 'phq2phq9',
            },
        ],
        meta: {
            createdAt: '2023-04-06T02:32:41.569773Z',
            lastUpdated: '2023-04-06T02:33:06.758734Z',
            versionId: '20508',
        },
        questionnaire: 'phq2phq9',
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'completed',
    }),
);

const immunization_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'immunization',
        meta: {
            lastUpdated: '2023-04-06T02:39:03.018390Z',
            versionId: '20519',
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T02:38:51.964987Z',
                },
            ],
        },
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        item: [
            {
                answer: [
                    {
                        valueDateTime: '2023-04-06T02:38:50+00:00',
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        valueString: 'e133b999-9e91-4ebd-967e-450bad770682',
                    },
                ],
                linkId: 'encounterId',
            },
            {
                answer: [
                    {
                        valueString: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        valueString: 'Emily Nguyen',
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        valueCoding: {
                            code: '173',
                            system: 'http://hl7.org/fhir/sid/cvx',
                            display: 'cholera, BivWC',
                        },
                    },
                ],
                linkId: 'vaccine-code',
            },
            {
                answer: [
                    {
                        valueDate: '2023-04-13',
                    },
                ],
                linkId: 'date-of-injection',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'completed',
        id: '5d59e534-a7ce-4254-8a41-31b3895ea525',
        authored: '2023-04-06T02:39:02Z',
    }),
);

const immunization_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'immunization',
        meta: {
            lastUpdated: '2023-04-06T02:39:03.018390Z',
            createdAt: '2023-04-06T02:38:51.964987Z',
            versionId: '20519',
        },
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        item: [
            {
                answer: [
                    {
                        value: {
                            dateTime: '2023-04-06T02:38:50+00:00',
                        },
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'e133b999-9e91-4ebd-967e-450bad770682',
                        },
                    },
                ],
                linkId: 'encounterId',
            },
            {
                answer: [
                    {
                        value: {
                            string: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                        },
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily Nguyen',
                        },
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        value: {
                            Coding: {
                                code: '173',
                                system: 'http://hl7.org/fhir/sid/cvx',
                                display: 'cholera, BivWC',
                            },
                        },
                    },
                ],
                linkId: 'vaccine-code',
            },
            {
                answer: [
                    {
                        value: {
                            date: '2023-04-13',
                        },
                    },
                ],
                linkId: 'date-of-injection',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'completed',
        id: '5d59e534-a7ce-4254-8a41-31b3895ea525',
        authored: '2023-04-06T02:39:02Z',
    }),
);

const cardiology_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'cardiology-example',
        meta: {
            lastUpdated: '2023-04-06T02:43:40.015349Z',
            versionId: '20529',
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T02:43:16.150751Z',
                },
            ],
        },
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        item: [
            {
                answer: [
                    {
                        valueString: '123',
                    },
                ],
                linkId: 'complaints',
            },
            {
                answer: [
                    {
                        valueString: '123',
                    },
                ],
                linkId: 'examination-objective',
            },
            {
                answer: [
                    {
                        valueString: '321',
                    },
                ],
                linkId: 'observations-data',
            },
            {
                answer: [
                    {
                        valueString: '321',
                    },
                ],
                linkId: 'lab-data',
            },
            {
                item: [
                    {
                        item: [
                            {
                                answer: [
                                    {
                                        valueCoding: {
                                            code: 'BA40',
                                            system: 'http://id.who.int/icd/release/11/mms',
                                            display: 'BA40 Angina pectoris',
                                        },
                                    },
                                ],
                                linkId: 'ds-icd-11',
                            },
                            {
                                answer: [
                                    {
                                        valueString: 'desc 123',
                                    },
                                ],
                                linkId: 'ds-text',
                            },
                        ],
                        linkId: 'ds-main',
                    },
                ],
                linkId: 'group-ds',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'completed',
        id: '16917bdf-309f-4cd7-9a8a-56a928dbedea',
        authored: '2023-04-06T02:43:39Z',
    }),
);

const cardiology_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'cardiology-example',
        meta: {
            lastUpdated: '2023-04-06T02:43:40.015349Z',
            createdAt: '2023-04-06T02:43:16.150751Z',
            versionId: '20529',
        },
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        item: [
            {
                answer: [
                    {
                        value: {
                            string: '123',
                        },
                    },
                ],
                linkId: 'complaints',
            },
            {
                answer: [
                    {
                        value: {
                            string: '123',
                        },
                    },
                ],
                linkId: 'examination-objective',
            },
            {
                answer: [
                    {
                        value: {
                            string: '321',
                        },
                    },
                ],
                linkId: 'observations-data',
            },
            {
                answer: [
                    {
                        value: {
                            string: '321',
                        },
                    },
                ],
                linkId: 'lab-data',
            },
            {
                item: [
                    {
                        item: [
                            {
                                answer: [
                                    {
                                        value: {
                                            Coding: {
                                                code: 'BA40',
                                                system: 'http://id.who.int/icd/release/11/mms',
                                                display: 'BA40 Angina pectoris',
                                            },
                                        },
                                    },
                                ],
                                linkId: 'ds-icd-11',
                            },
                            {
                                answer: [
                                    {
                                        value: {
                                            string: 'desc 123',
                                        },
                                    },
                                ],
                                linkId: 'ds-text',
                            },
                        ],
                        linkId: 'ds-main',
                    },
                ],
                linkId: 'group-ds',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'completed',
        id: '16917bdf-309f-4cd7-9a8a-56a928dbedea',
        authored: '2023-04-06T02:43:39Z',
    }),
);

const allergies_inprogress_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'allergies',
        meta: {
            lastUpdated: '2023-04-06T02:48:18.132716Z',
            versionId: '20530',
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-06T02:48:18.132716Z',
                },
            ],
        },
        encounter: {
            reference: 'Encounter/e133b999-9e91-4ebd-967e-450bad770682',
        },
        item: [
            {
                answer: [
                    {
                        valueDateTime: '2023-04-06T02:48:16+00:00',
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        valueString: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        valueString: 'Emily Nguyen',
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        valueCoding: {
                            code: 'active',
                            system: 'http://terminology.hl7.org/ValueSet/allergyintolerance-clinical',
                            display: 'Active',
                        },
                    },
                ],
                linkId: 'status',
            },
            {
                answer: [],
                linkId: 'type',
            },
            {
                answer: [],
                linkId: 'reaction',
            },
            {
                answer: [
                    {
                        value: {},
                    },
                ],
                linkId: 'notes',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            reference: 'Patient/683e382b-fed4-433e-9b6d-a847a7953bc0',
        },
        status: 'in-progress',
        id: 'f0a0b4cf-ff0e-47e2-814d-3327a138653e',
        authored: '2023-04-06T02:48:17.734Z',
    }),
);

const allergies_inprogress_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        questionnaire: 'allergies',
        meta: {
            lastUpdated: '2023-04-06T02:48:18.132716Z',
            createdAt: '2023-04-06T02:48:18.132716Z',
            versionId: '20530',
        },
        encounter: {
            id: 'e133b999-9e91-4ebd-967e-450bad770682',
            resourceType: 'Encounter',
        },
        item: [
            {
                answer: [
                    {
                        value: {
                            dateTime: '2023-04-06T02:48:16+00:00',
                        },
                    },
                ],
                linkId: 'dateTime',
            },
            {
                answer: [
                    {
                        value: {
                            string: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                        },
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily Nguyen',
                        },
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        value: {
                            Coding: {
                                code: 'active',
                                system: 'http://terminology.hl7.org/ValueSet/allergyintolerance-clinical',
                                display: 'Active',
                            },
                        },
                    },
                ],
                linkId: 'status',
            },
            {
                answer: [],
                linkId: 'type',
            },
            {
                answer: [],
                linkId: 'reaction',
            },
            {
                answer: [
                    {
                        value: {},
                    },
                ],
                linkId: 'notes',
            },
        ],
        resourceType: 'QuestionnaireResponse',
        source: {
            id: '683e382b-fed4-433e-9b6d-a847a7953bc0',
            resourceType: 'Patient',
        },
        status: 'in-progress',
        id: 'f0a0b4cf-ff0e-47e2-814d-3327a138653e',
        authored: '2023-04-06T02:48:17.734Z',
    }),
);

const newappointment_fhir_QuestionnaireResponse: FHIRQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-05T06:27:57Z',
        id: 'cf6d9d4b-bfcd-463f-9d26-b6769c2a3fc3',
        item: [
            {
                answer: [
                    {
                        valueString: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        valueString: 'Emily Nguyen',
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        valueReference: {
                            display: 'Sanjay Patel - Cardiology',
                            reference: 'PractitionerRole/429e6a55-8a64-4ede-ad12-1206522253eb',
                            resource: {
                                healthcareService: [
                                    {
                                        display: 'The first appointment',
                                        id: 'consultation',
                                        resourceType: 'HealthcareService',
                                    },
                                    {
                                        display: 'A follow up visit',
                                        id: 'follow-up',
                                        resourceType: 'HealthcareService',
                                    },
                                ],
                                id: '429e6a55-8a64-4ede-ad12-1206522253eb',
                                meta: {
                                    createdAt: '2023-04-05T06:09:11.092359Z',
                                    lastUpdated: '2023-04-05T06:09:11.092359Z',
                                    versionId: '20418',
                                },
                                practitioner: {
                                    id: '42e9bdc0-4fe6-4b8d-a6a5-fcb68f1fe836',
                                    resource: {
                                        id: '42e9bdc0-4fe6-4b8d-a6a5-fcb68f1fe836',
                                        meta: {
                                            createdAt: '2023-04-05T06:09:11.092359Z',
                                            lastUpdated: '2023-04-05T06:09:11.092359Z',
                                            versionId: '20416',
                                        },
                                        name: [
                                            {
                                                family: 'Patel',
                                                given: ['Sanjay', 'Kumar'],
                                            },
                                        ],
                                        resourceType: 'Practitioner',
                                    },
                                    resourceType: 'Practitioner',
                                },
                                resourceType: 'PractitionerRole',
                                specialty: [
                                    {
                                        coding: [
                                            {
                                                code: '394579002',
                                                display: 'Cardiology',
                                                system: 'http://snomed.info/sct',
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
                linkId: 'practitioner-role',
            },
            {
                answer: [
                    {
                        valueCoding: {
                            code: 'consultation',
                            display: 'The first appointment',
                            system: 'http://fhir.org/guides/argonaut-scheduling/CodeSystem/visit-type',
                        },
                    },
                ],
                linkId: 'service',
            },
            {
                answer: [
                    {
                        valueDate: '2023-04-26',
                    },
                ],
                linkId: 'date',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                valueTime: '15:00:00',
                            },
                        ],
                        linkId: 'start-time',
                    },
                    {
                        answer: [
                            {
                                valueTime: '16:00:00',
                            },
                        ],
                        linkId: 'end-time',
                    },
                ],
                linkId: 'Time period',
            },
        ],
        meta: {
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2023-04-05T06:27:58.499391Z',
                },
            ],
            lastUpdated: '2023-04-05T06:27:58.499391Z',
            versionId: '20420',
        },
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
    }),
);

const newappointment_aidbox_QuestionnaireResponse: AidboxQuestionnaireResponse = JSON.parse(
    JSON.stringify({
        authored: '2023-04-05T06:27:57Z',
        id: 'cf6d9d4b-bfcd-463f-9d26-b6769c2a3fc3',
        item: [
            {
                answer: [
                    {
                        value: {
                            string: '683e382b-fed4-433e-9b6d-a847a7953bc0',
                        },
                    },
                ],
                linkId: 'patientId',
            },
            {
                answer: [
                    {
                        value: {
                            string: 'Emily Nguyen',
                        },
                    },
                ],
                linkId: 'patientName',
            },
            {
                answer: [
                    {
                        value: {
                            Reference: {
                                display: 'Sanjay Patel - Cardiology',
                                id: '429e6a55-8a64-4ede-ad12-1206522253eb',
                                resource: {
                                    healthcareService: [
                                        {
                                            display: 'The first appointment',
                                            id: 'consultation',
                                            resourceType: 'HealthcareService',
                                        },
                                        {
                                            display: 'A follow up visit',
                                            id: 'follow-up',
                                            resourceType: 'HealthcareService',
                                        },
                                    ],
                                    id: '429e6a55-8a64-4ede-ad12-1206522253eb',
                                    meta: {
                                        createdAt: '2023-04-05T06:09:11.092359Z',
                                        lastUpdated: '2023-04-05T06:09:11.092359Z',
                                        versionId: '20418',
                                    },
                                    practitioner: {
                                        id: '42e9bdc0-4fe6-4b8d-a6a5-fcb68f1fe836',
                                        resource: {
                                            id: '42e9bdc0-4fe6-4b8d-a6a5-fcb68f1fe836',
                                            meta: {
                                                createdAt: '2023-04-05T06:09:11.092359Z',
                                                lastUpdated: '2023-04-05T06:09:11.092359Z',
                                                versionId: '20416',
                                            },
                                            name: [
                                                {
                                                    family: 'Patel',
                                                    given: ['Sanjay', 'Kumar'],
                                                },
                                            ],
                                            resourceType: 'Practitioner',
                                        },
                                        resourceType: 'Practitioner',
                                    },
                                    resourceType: 'PractitionerRole',
                                    specialty: [
                                        {
                                            coding: [
                                                {
                                                    code: '394579002',
                                                    display: 'Cardiology',
                                                    system: 'http://snomed.info/sct',
                                                },
                                            ],
                                        },
                                    ],
                                },
                                resourceType: 'PractitionerRole',
                            },
                        },
                    },
                ],
                linkId: 'practitioner-role',
            },
            {
                answer: [
                    {
                        value: {
                            Coding: {
                                code: 'consultation',
                                display: 'The first appointment',
                                system: 'http://fhir.org/guides/argonaut-scheduling/CodeSystem/visit-type',
                            },
                        },
                    },
                ],
                linkId: 'service',
            },
            {
                answer: [
                    {
                        value: {
                            date: '2023-04-26',
                        },
                    },
                ],
                linkId: 'date',
            },
            {
                item: [
                    {
                        answer: [
                            {
                                value: {
                                    time: '15:00:00',
                                },
                            },
                        ],
                        linkId: 'start-time',
                    },
                    {
                        answer: [
                            {
                                value: {
                                    time: '16:00:00',
                                },
                            },
                        ],
                        linkId: 'end-time',
                    },
                ],
                linkId: 'Time period',
            },
        ],
        meta: {
            createdAt: '2023-04-05T06:27:58.499391Z',
            lastUpdated: '2023-04-05T06:27:58.499391Z',
            versionId: '20420',
        },
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
    }),
);
