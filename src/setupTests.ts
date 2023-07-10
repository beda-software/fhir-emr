// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import { createFHIRResource, getReference, saveFHIRResource } from 'fhir-react/lib/services/fhir';
import {
    resetInstanceToken as resetFHIRInstanceToken,
    setInstanceBaseURL as setFHIRInstanceBaseURL,
    setInstanceToken as setFHIRInstanceToken,
} from 'fhir-react/lib/services/instance';
import { ensure } from 'fhir-react/lib/utils/tests';
import { Encounter, Patient, Practitioner, PractitionerRole, Reference, Resource } from 'fhir/r4b';

import { saveFHIRResource as aidboxSaveFHIRResource } from 'aidbox-react/lib/services/fhir';
import {
    axiosInstance,
    resetInstanceToken as resetAidboxInstanceToken,
    setInstanceBaseURL as setAidboxInstanceBaseURL,
    setInstanceToken as setAidboxInstanceToken,
} from 'aidbox-react/lib/services/instance';
import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';
import { withRootAccess, LoginService, getToken } from 'aidbox-react/lib/utils/tests';

import { User } from 'shared/src/contrib/aidbox';

import { login as loginService } from 'src/services/auth';

declare global {
    var AppleID: any;
}

global.AppleID = {
    auth: {
        init: jest.fn(),
    },
};

// 'jose' library import fails in non-node jest test environments
// complaining about TextEncoder not being found:
// `ReferenceError: TextEncoder is not defined`.
// Mocking it here as there are no JWT-bound tests at the moment.
jest.mock('jose', () => ({}));

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

export async function createEncounter(
    subject: Reference,
    participant: Reference,
    date?: moment.Moment,
) {
    return ensure(
        await createFHIRResource<Encounter>({
            resourceType: 'Encounter',
            subject,
            participant: [{ individual: participant }],
            status: 'planned',
            class: {
                code: 'HH',
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            },
            ...(date ? { period: { start: formatFHIRDateTime(date) } } : {}),
        }),
    );
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

async function login(user: User) {
    resetAidboxInstanceToken();
    resetFHIRInstanceToken();

    const token = await getToken(user, loginService as LoginService);

    setFHIRInstanceToken(token);
    setAidboxInstanceToken(token);

    return token;
}

export const loginAdminUser = async () => {
    await login({ email: 'admin', id: 'admin', password: 'password' } as User);
};

export const loginUser = async (user: User) => {
    await login({ ...user, password: USER_PASSWORD });
};

beforeAll(async () => {
    jest.useFakeTimers();
    setAidboxInstanceBaseURL('http://localhost:8080');
    setFHIRInstanceBaseURL('http://localhost:8080/fhir');
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

afterAll(() => {
    jest.clearAllTimers();
});
