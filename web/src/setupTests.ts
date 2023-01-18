// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { createFHIRResource } from 'aidbox-react/lib/services/fhir';
import {
    axiosInstance,
    resetInstanceToken,
    setInstanceBaseURL,
} from 'aidbox-react/lib/services/instance';
import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';
import { ensure, withRootAccess } from 'aidbox-react/lib/utils/tests';
import { AidboxReference, Encounter, Patient, Practitioner } from 'shared/src/contrib/aidbox';

beforeAll(async () => {
    jest.useFakeTimers();
    setInstanceBaseURL('http://localhost:8080');
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
    resetInstanceToken();
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

export async function createPatient(patient: Partial<Patient> = {}) {
    return ensure(
        await createFHIRResource<Patient>({
            resourceType: 'Patient',
            ...patient,
        }),
    );
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
    subject: AidboxReference<Patient>,
    participant: AidboxReference<Practitioner>,
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
