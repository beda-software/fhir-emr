import { act, renderHook, waitFor } from '@testing-library/react';
import { Consent, Period, Reference } from 'fhir/r4b';

import { isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { getReference } from 'fhir-react/lib/services/fhir';
import { withRootAccess } from 'fhir-react/lib/utils/tests';
import { uuid4 } from 'fhir-react/lib/utils/uuid';

import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { createConsent, createPatient, createPractitioner, loginAdminUser } from 'src/setupTests';

import { usePatientList } from '../hooks';
import { getPatientSearchParamsForPractitioner } from '../utils';

const PATIENTS_ADDITION_DATA = [
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

describe('Patient list filters testing', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    // TODO: Turn off parallel test running
    // vitest --no-threads added, but still there is an error
    // https://vitest.dev/guide/features.html#threads
    test.skip('String filters', async () => {
        const patient1 = await createPatient(PATIENTS_ADDITION_DATA[0]);
        const patient2 = await createPatient(PATIENTS_ADDITION_DATA[1]);

        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: [
                    {
                        id: 'patient',
                        type: 'string',
                        placeholder: `Search by patient`,
                    },
                ],
            });

            const { patientsResponse } = usePatientList(columnsFilterValues as StringTypeColumnFilterValue[], {});

            return {
                columnsFilterValues,
                patientsResponse,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await waitFor(
            () => {
                expect(isSuccess(result.current.patientsResponse)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(2);
            expect(result.current.patientsResponse.data[0]?.id).toEqual(patient2.id);
            expect(result.current.patientsResponse.data[1]?.id).toEqual(patient1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter('john', 'patient');
        });
        await waitFor(() => {
            expect(isLoading(result.current.patientsResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.patientsResponse);
        });
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(1);
            expect(result.current.patientsResponse.data[0]?.id).toEqual(patient1.id);
        }

        act(() => {
            result.current.onChangeColumnFilter('testtest', 'patient');
        });
        await waitFor(() => {
            expect(isLoading(result.current.patientsResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.patientsResponse);
        });
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(0);
        }

        act(() => {
            result.current.onChangeColumnFilter('ivan', 'patient');
        });
        await waitFor(() => {
            expect(isLoading(result.current.patientsResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.patientsResponse);
        });
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(1);
            expect(result.current.patientsResponse.data[0]?.id).toEqual(patient2.id);
        }

        act(() => {
            result.current.onResetFilters();
        });
        await waitFor(() => {
            expect(isLoading(result.current.patientsResponse)).toBeTruthy();
        });
        await waitFor(() => {
            isSuccess(result.current.patientsResponse);
        });
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(2);
        }
    });
});

function createConsentData(
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

async function patientsListWithConsentSetup(practitionerId: string) {
    const data = withRootAccess(async () => {
        const practitioner1 = await createPractitioner({ id: practitionerId });
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

        return {
            consents: [consent1, consent2, consent3, consent4, consent5, consent6],
            patients: [patient1, patient2, patient3],
        };
    });

    return data;
}

describe('Patient list get by consent', () => {
    const practitionerId = uuid4();
    beforeAll(async () => {
        await loginAdminUser();
    });

    test('Get patients with signed consent', async () => {
        const data = await patientsListWithConsentSetup(practitionerId);

        const { result } = renderHook(() => {
            const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
                columns: [
                    {
                        id: 'patient',
                        type: 'string',
                        placeholder: `Search by patient`,
                    },
                ],
            });

            const searchParams = getPatientSearchParamsForPractitioner(practitionerId);

            const { patientsResponse } = usePatientList(
                columnsFilterValues as StringTypeColumnFilterValue[],
                searchParams,
            );

            return {
                columnsFilterValues,
                patientsResponse,
                onChangeColumnFilter,
                onResetFilters,
            };
        });

        await waitFor(
            () => {
                expect(isSuccess(result.current.patientsResponse)).toBeTruthy();
            },
            { timeout: 30000 },
        );
        if (isSuccess(result.current.patientsResponse)) {
            expect(result.current.patientsResponse.data.length).toEqual(1);
            expect(result.current.patientsResponse.data?.[0]?.id).toEqual(data.patients[2]?.id);
        }
    });
});
