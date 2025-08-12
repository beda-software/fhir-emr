import { Consent, Period, Reference } from 'fhir/r4b';

import { formatFHIRDate } from 'aidbox-react/lib/utils/date';

import { User } from '@beda.software/aidbox-types';
import { ensure, getReference, withRootAccess } from '@beda.software/fhir-react';

import { axiosInstance, createFHIRResource } from 'src/services/fhir';
import { createConsent, createPatient, createPractitioner, ensureSave, login } from 'src/setupTests';

export const PATIENTS_ADDITION_DATA = [
    {
        name: [
            {
                given: ['1', '1'],
                family: 'Patient',
            },
        ],
    },
    {
        name: [
            {
                given: ['2', '2'],
                family: 'Patient',
            },
        ],
    },
    {
        name: [
            {
                given: ['3', '3'],
                family: 'Patient',
            },
        ],
    },
];

export const initialSetup = async () => {
    const data = await dataSetup();
    await login({ ...data.user, password: 'password' });
    return data;
};

export async function createUser(userData: Partial<User>) {
    return ensure(
        await createFHIRResource<User>({
            resourceType: 'User',
            ...userData,
        }),
    );
}

export function createConsentData(
    patientRef: Reference,
    practitionerRef: Reference,
    statusCode: 'active' | 'proposed',
    categoryCode: string,
    period: Period,
): Partial<Consent> {
    return {
        patient: patientRef,
        category: [
            {
                coding: [
                    {
                        code: categoryCode,
                        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                    },
                ],
            },
        ],
        provision: {
            type: 'permit',
            actor: [
                {
                    role: {
                        coding: [
                            {
                                code: 'PROV',
                                system: 'http://terminology.hl7.org/CodeSystem/v3-RoleClass',
                            },
                        ],
                    },
                    reference: practitionerRef,
                },
            ],
            action: [
                {
                    coding: [
                        {
                            code: 'access',
                            system: 'http://terminology.hl7.org/CodeSystem/consentaction',
                        },
                    ],
                },
            ],
            period: period,
            purpose: [
                {
                    code: 'CAREMGT',
                    system: 'http://terminology.hl7.org/CodeSystem/v3-ActReason',
                    display: 'care management',
                },
            ],
        },
        resourceType: 'Consent',
        scope: {
            coding: [
                {
                    code: 'patient-privacy',
                    system: 'http://terminology.hl7.org/CodeSystem/consentscope',
                },
            ],
        },
        status: statusCode,
        performer: [practitionerRef],
    };
}

export function dataSetup() {
    const data = withRootAccess(axiosInstance, async () => {
        const practitioner1 = await createPractitioner();
        const user = await createUser({
            fhirUser: {
                id: practitioner1.id!,
                resourceType: 'Practitioner',
            },
            password: 'password',
            resourceType: 'User',
            email: 'test@beda.software',
        });
        const role = await ensureSave({
            name: 'practitioner',
            user: {
                id: user.id!,
                resourceType: 'User',
            },
            links: {
                practitioner: {
                    id: practitioner1.id,
                    resourceType: 'Practitioner',
                },
            },
            resourceType: 'Role',
        });
        const practitioner2 = await createPractitioner();
        const patient1 = await createPatient(PATIENTS_ADDITION_DATA[0]);
        const patient2 = await createPatient(PATIENTS_ADDITION_DATA[1]);
        const patient3 = await createPatient(PATIENTS_ADDITION_DATA[2]);

        const consentStatus: { incorrect: 'proposed' | 'active'; correct: 'proposed' | 'active' } = {
            incorrect: 'proposed',
            correct: 'active',
        };

        const consentType = {
            incorrect: 'no-data-sharing',
            correct: 'data-sharing',
        };

        const actor = {
            incorrect: getReference(practitioner2),
            correct: getReference(practitioner1),
        };

        const period = {
            incorrect: {
                end: '2010-01-01',
                start: '2020-01-01',
            },
            correct: {
                end: '2030-01-01',
                start: '2023-01-01',
            },
        };

        const consent1 = await createConsent(
            createConsentData(
                getReference(patient1),
                actor['incorrect'],
                consentStatus['incorrect'],
                consentType['incorrect'],
                period['incorrect'],
            ),
        );
        const consent2 = await createConsent(
            createConsentData(
                getReference(patient2),
                actor['incorrect'],
                consentStatus['incorrect'],
                consentType['incorrect'],
                period['correct'],
            ),
        );
        const consent3 = await createConsent(
            createConsentData(
                getReference(patient2),
                actor['incorrect'],
                consentStatus['incorrect'],
                consentType['correct'],
                period['incorrect'],
            ),
        );
        const consent4 = await createConsent(
            createConsentData(
                getReference(patient2),
                actor['incorrect'],
                consentStatus['correct'],
                consentType['incorrect'],
                period['incorrect'],
            ),
        );
        const consent5 = await createConsent(
            createConsentData(
                getReference(patient2),
                actor['correct'],
                consentStatus['incorrect'],
                consentType['incorrect'],
                period['incorrect'],
            ),
        );
        const consent6 = await createConsent(
            createConsentData(
                getReference(patient3),
                actor['correct'],
                consentStatus['correct'],
                consentType['correct'],
                period['correct'],
            ),
        );

        const correctSearchParams = {
            status: 'active',
            category: 'data-sharing',
            period: formatFHIRDate(new Date()),
            actor: practitioner1.id,
            _include: ['Consent:patient:Patient'],
        };

        return {
            user,
            role,
            correctSearchParams,
            practitioner: practitioner1,
            consents: [consent1, consent2, consent3, consent4, consent5, consent6],
            patients: [patient1, patient2, patient3],
        };
    });

    return data;
}
