import '@testing-library/jest-dom/extend-expect';

import {
    Consent,
    Encounter,
    HealthcareService,
    Patient,
    Practitioner,
    PractitionerRole,
    Reference,
    Resource,
} from 'fhir/r4b';

import { saveFHIRResource as aidboxSaveFHIRResource } from 'aidbox-react/lib/services/fhir';
import {
    axiosInstance,
    resetInstanceToken as resetAidboxInstanceToken,
    setInstanceBaseURL as setAidboxInstanceBaseURL,
} from 'aidbox-react/lib/services/instance';
import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';
import { withRootAccess, LoginService, getToken } from 'aidbox-react/lib/utils/tests';

import { User, ValueSet } from '@beda.software/aidbox-types';
import { ensure, getReference } from '@beda.software/fhir-react';

import { restoreUserSession } from 'src/containers/App/utils.ts';
import { login as loginService } from 'src/services/auth';
import { createFHIRResource, saveFHIRResource, resetInstanceToken as resetFHIRInstanceToken } from 'src/services/fhir';

declare global {
    // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
    var AppleID: any;
}

global.AppleID = {
    auth: {
        init: vi.fn(),
    },
};

export async function createConsent(consent: Partial<Consent> = {}) {
    return ensure(
        await createFHIRResource<Consent>({
            resourceType: 'Consent',
            category: [
                {
                    coding: [
                        {
                            code: 'some-demo-category',
                            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                        },
                    ],
                },
            ],
            scope: {
                coding: [
                    {
                        code: 'patient-privacy',
                        system: 'http://terminology.hl7.org/CodeSystem/consentscope',
                    },
                ],
            },
            status: 'active',
            ...consent,
        }),
    );
}

export async function createHealthcareService(healthcareService: Partial<HealthcareService> = {}) {
    return ensure(
        await createFHIRResource<HealthcareService>({
            resourceType: 'HealthcareService',
            active: true,
            ...healthcareService,
        }),
    );
}

// 'jose' library import fails in non-node jest test environments
// complaining about TextEncoder not being found:
// `ReferenceError: TextEncoder is not defined`.
// Mocking it here as there are no JWT-bound tests at the moment.
// jest.mock('jose', () => ({}));

export async function createPatient(patient: Partial<Patient> = {}) {
    return ensure(
        await createFHIRResource<Patient>({
            resourceType: 'Patient',
            ...patient,
        }),
    );
}

export async function createPractitionerRole(
    practitionerData: Partial<Practitioner>,
    practitionerRoleData: Partial<PractitionerRole> = {},
) {
    const practitioner = await createPractitioner(practitionerData);

    const practitionerRole = ensure(
        await createFHIRResource<PractitionerRole>({
            resourceType: 'PractitionerRole',
            practitioner: getReference(practitioner),
            ...practitionerRoleData,
        }),
    );

    return { practitionerRole, practitioner };
}

export async function createPractitioner(practitioner: Partial<Practitioner> = {}) {
    return ensure(
        await createFHIRResource<Practitioner>({
            resourceType: 'Practitioner',
            ...practitioner,
        }),
    );
}

type ParticipantWithDisplay = Reference & { display?: string };
export async function createEncounter(subject: Reference, participant: ParticipantWithDisplay, date?: moment.Moment) {
    return ensure(
        await createFHIRResource<Encounter>({
            resourceType: 'Encounter',
            subject,
            participant: [
                { individual: { ...participant, ...(participant.display ? { display: participant.display } : {}) } },
            ],
            status: 'planned',
            class: {
                code: 'HH',
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            },
            ...(date ? { period: { start: formatFHIRDateTime(date) } } : {}),
        }),
    );
}

export async function createValueSet(valueSetData: Partial<ValueSet>) {
    await createFHIRResource<ValueSet>({
        resourceType: 'ValueSet',
        status: 'active',
        ...valueSetData,
    });
}

export async function ensureSave<R extends Resource>(resource: R): Promise<R> {
    const result = await saveFHIRResource(resource);

    return ensure(result);
}

const USER_PASSWORD = 'Password1!';

export const createUser = async ({ patient, user }: { patient: Patient; user?: Partial<User> }) => {
    const result = await aidboxSaveFHIRResource<User>({
        resourceType: 'User',
        email: `test${Math.random().toString(36)}@beda.software`,
        password: USER_PASSWORD,
        userType: 'patient',
        active: true,
        data: {
            patient: {
                id: patient.id!,
                resourceType: 'Patient',
            },
        },
        ...(user ?? {}),
    });

    return ensure(result);
};

export async function login(user: User) {
    resetAidboxInstanceToken();
    resetFHIRInstanceToken();

    const token = await getToken(user, loginService as LoginService);

    await restoreUserSession(token.access_token);

    return token;
}

export const loginAdminUser = async () => {
    await login({ email: 'admin', id: 'admin', password: 'password' } as User);
};

export const loginUser = async (user: User) => {
    await login({ ...user, password: USER_PASSWORD });
};

beforeAll(async () => {
    // vi.useFakeTimers();
    setAidboxInstanceBaseURL('http://localhost:8080');
});

let txId: string;

beforeEach(async () => {
    await withRootAccess(async () => {
        const response = await axiosInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: 'SELECT last_value from transaction_id_seq;' },
        });
        txId = response.data[0].result[0].last_value;

        return response;
    });
});

afterEach(async () => {
    resetAidboxInstanceToken();
    resetFHIRInstanceToken();
    await withRootAccess(async () => {
        await axiosInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: `select drop_before_all(${txId});` },
        });
    });
});

// afterAll(() => {
//     vi.clearAllTimers();
// });

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
});

vi.mock('react-router-dom', async () => {
    const mod = (await vi.importActual('react-router-dom')) as any;

    return {
        ...mod,
        useNavigate: () => vi.fn(),
        useLocation: vi.fn().mockReturnValue({
            pathname: '/testroute',
            search: '',
            hash: '',
            state: null,
        }),
        useParams: vi.fn().mockReturnValue({}),
    };
});
