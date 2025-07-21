import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { screen, render, act, fireEvent, waitFor } from '@testing-library/react';
import { RemoteDataResult } from 'aidbox-react';
import { Bundle, Patient, Practitioner, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { describe, expect, test, vi } from 'vitest';

import { axiosInstance } from 'aidbox-react/lib/services/instance';

import { ensure, extractBundleResources, getReference, WithId, withRootAccess } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import { QuestionnaireResponseDraftService } from 'src/hooks';
import { createFHIRResource, getFHIRResources } from 'src/services';
import { createPatient, createPractitionerRole, loginAdminUser, waitForAPIProcess } from 'src/setupTests';
import { ThemeProvider } from 'src/theme';

const questionnaireId = 'test-draft-flow-q';
const questionnaireLinkId = 'test-draft-flow-q-text';
const questionnaireDefinition: WithId<Questionnaire> = {
    resourceType: 'Questionnaire',
    status: 'active',
    id: questionnaireId,
    name: questionnaireId,
    title: questionnaireId,
    meta: {
        profile: ['https://emr-core.beda.software/StructureDefinition/fhir-emr-questionnaire'],
    },
    item: [
        {
            text: 'Text',
            type: 'string',
            linkId: questionnaireLinkId,
        },
    ],
};

async function setup() {
    await loginAdminUser();
    return await withRootAccess(axiosInstance, async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const { practitioner, practitionerRole } = await createPractitionerRole({});

        const questionnaire = ensure(await createFHIRResource<WithId<Questionnaire>>(questionnaireDefinition));

        return { patient, practitioner, practitionerRole, questionnaire };
    });
}

async function renderForm(
    patient: Patient,
    practitioner: WithId<Practitioner>,
    autoSave: boolean,
    qrDraftServiceType?: QuestionnaireResponseDraftService,
) {
    const onSuccess = vi.fn();

    act(() => {
        i18n.activate('en');
    });

    render(
        <ThemeProvider>
            <I18nProvider i18n={i18n}>
                <PatientDocument
                    patient={patient}
                    author={practitioner}
                    questionnaireId={questionnaireId}
                    onSuccess={onSuccess}
                    autoSave={autoSave}
                    qrDraftServiceType={qrDraftServiceType}
                />
            </I18nProvider>
        </ThemeProvider>,
    );

    return onSuccess;
}

describe('Draft questionnaire response saves correctly with server backend', async () => {
    test('Test QuestionnaireResponse autosave', async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        await renderForm(patient, practitioner, true, 'server');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        await new Promise((r) => setTimeout(r, 2000));

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'in-progress',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });

        const qrs = ensure(
            mapSuccess(
                await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'in-progress',
                    _sort: ['-createdAt', '_id'],
                }),
                (result) => extractBundleResources<QuestionnaireResponse>(result).QuestionnaireResponse,
            ),
        );

        expect(qrs.length).toBe(1);
        expect(qrs[0]!.status).toBe('in-progress');
        expect(qrs[0]!.subject!.reference).toBe(getReference(patient).reference);
    }, 60000);

    test('Test QuestionnaireResponse is not duplicated by autosave', async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        const onSuccess = await renderForm(patient, practitioner, true, 'server');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).toBeEnabled();

        act(() => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());

        await new Promise((r) => setTimeout(r, 2000));

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });

        const qrs = ensure(
            mapSuccess(
                await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    _sort: ['-createdAt', '_id'],
                }),
                (result) => extractBundleResources<QuestionnaireResponse>(result).QuestionnaireResponse,
            ),
        );

        expect(qrs.length).toBe(1);
        expect(qrs[0]!.status).toBe('completed');
        expect(qrs[0]!.subject!.reference).toBe(getReference(patient).reference);
    }, 60000);

    test("Test QuestionnaireResponse autosave doesn't reset completed status", async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        const onSuccess = await renderForm(patient, practitioner, true, 'server');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'in-progress',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });

        act(() => {
            fireEvent.change(textInput, {
                target: { value: 'update value' },
            });
        });

        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).toBeEnabled();

        act(() => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());

        await new Promise((r) => setTimeout(r, 2000));

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'completed',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });
    }, 60000);
});

describe('Draft questionnaire response saves correctly with local storage backend', async () => {
    beforeEach(() => {
        // Mock localStorage, because it wasn't available in the test environment
        const store: Record<string, string> = {};

        global.localStorage = {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => {
                store[key] = value;
            },
            removeItem: (key) => {
                delete store[key];
            },
            clear: () => {
                Object.keys(store).forEach((key) => delete store[key]);
            },
        } as Storage;
    });

    test('Test QuestionnaireResponse autosave with local storage backend', async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        const draftId = `Patient/${patient.id}/${questionnaireId}`;

        await renderForm(patient, practitioner, true, 'local');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        await new Promise((r) => setTimeout(r, 3000));

        expect(localStorage.getItem(draftId)).toBeDefined();
        const localStorageQR = JSON.parse(localStorage.getItem(draftId)!);
        expect(localStorageQR).toBeDefined();
        expect(localStorageQR.questionnaire).toBe(questionnaireId);
        expect(localStorageQR.status).toBe('in-progress');
        expect(localStorageQR.subject).toBeDefined();
        expect(localStorageQR.subject.reference).toBe(getReference(patient).reference);
        expect(localStorageQR.item).toBeDefined();
        expect(localStorageQR.item[0].answer[0].valueString).toBe(testFieldValue);

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'in-progress',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 0;
            },
        });
    }, 60000);

    test('Test QuestionnaireResponse is not duplicated by autosave', async () => {
        const testFieldValue = 'Test 2';

        const { patient, practitioner } = await setup();

        const draftId = `Patient/${patient.id}/${questionnaireId}`;

        const onSuccess = await renderForm(patient, practitioner, true, 'local');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).toBeEnabled();

        act(() => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());

        await new Promise((r) => setTimeout(r, 3000));

        expect(localStorage.getItem(draftId)).toBeNull();

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });
    }, 60000);

    test("Test QuestionnaireResponse autosave doesn't reset completed status", async () => {
        const testFieldValue = 'Test 3';
        const testFieldUpdateValue = 'update value';

        const { patient, practitioner } = await setup();

        const draftId = `Patient/${patient.id}/${questionnaireId}`;

        const onSuccess = await renderForm(patient, practitioner, true, 'local');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        await waitForAPIProcess<string | null>({
            service: () => Promise.resolve(localStorage.getItem(draftId)),
            resolver: (result) => {
                return result !== null;
            },
        });

        expect(localStorage.getItem(draftId)).toBeDefined();
        const localStorageQR = JSON.parse(localStorage.getItem(draftId)!);
        expect(localStorageQR.item[0].answer[0].valueString).toBe(testFieldValue);

        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldUpdateValue },
            });
        });

        await waitForAPIProcess<string | null>({
            service: () => Promise.resolve(localStorage.getItem(draftId)),
            resolver: (result) => {
                const localStorageQR = JSON.parse(result!);
                const fieldValue = localStorageQR.item[0].answer[0].valueString;
                return fieldValue === testFieldUpdateValue;
            },
        });

        const localStorageQRupdate = JSON.parse(localStorage.getItem(draftId)!);
        expect(localStorageQRupdate.item[0].answer[0].valueString).toBe(testFieldUpdateValue);

        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).toBeEnabled();

        act(() => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());

        await new Promise((r) => setTimeout(r, 2000));

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'completed',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });
        expect(localStorage.getItem(draftId)).toBeNull();
    }, 60000);
});

describe('Draft questionnaire response not saved when autoSave is disabled', async () => {
    test('QuestionnaireResponse draft not created with disabled autosave', async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        await renderForm(patient, practitioner, false, 'server');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'in-progress',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 0;
            },
        });

        const qrs = ensure(
            mapSuccess(
                await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'in-progress',
                    _sort: ['-createdAt', '_id'],
                }),
                (result) => extractBundleResources<QuestionnaireResponse>(result).QuestionnaireResponse,
            ),
        );

        expect(qrs.length).toBe(0);
    }, 60000);

    test('Test QuestionnaireResponse is not duplicated when autosave disabled', async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        const onSuccess = await renderForm(patient, practitioner, false, 'server');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).toBeEnabled();

        act(() => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());

        await new Promise((r) => setTimeout(r, 2000));

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources<WithId<QuestionnaireResponse>>('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });

        const qrs = ensure(
            mapSuccess(
                await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    _sort: ['-createdAt', '_id'],
                }),
                (result) => extractBundleResources<QuestionnaireResponse>(result).QuestionnaireResponse,
            ),
        );

        expect(qrs.length).toBe(1);
        expect(qrs[0]!.status).toBe('completed');
        expect(qrs[0]!.subject!.reference).toBe(getReference(patient).reference);
    }, 60000);

    test("Test QuestionnaireResponse disabled autosave doesn't reset completed status", async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        const onSuccess = await renderForm(patient, practitioner, false, 'server');

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        const textInput = textField.querySelector('input')!;
        act(() => {
            fireEvent.change(textInput, {
                target: { value: testFieldValue },
            });
        });

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'in-progress',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 0;
            },
        });

        act(() => {
            fireEvent.change(textInput, {
                target: { value: 'update value' },
            });
        });

        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).toBeEnabled();

        act(() => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());

        await new Promise((r) => setTimeout(r, 2000));

        await waitForAPIProcess<RemoteDataResult<Bundle<WithId<QuestionnaireResponse>>>>({
            service: () =>
                getFHIRResources('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    status: 'completed',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });
        const qrs = ensure(
            mapSuccess(
                await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                    questionnaire: questionnaireId,
                    _sort: ['-createdAt', '_id'],
                }),
                (result) => extractBundleResources<QuestionnaireResponse>(result).QuestionnaireResponse,
            ),
        );

        expect(qrs.length).toBe(1);
        expect(qrs[0]!.status).toBe('completed');
        expect(qrs[0]!.subject!.reference).toBe(getReference(patient).reference);
    }, 60000);
});
