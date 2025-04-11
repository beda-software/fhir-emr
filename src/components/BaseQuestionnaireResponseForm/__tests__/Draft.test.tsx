import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { screen, render, act, fireEvent, waitFor } from '@testing-library/react';
import { RemoteDataResult } from 'aidbox-react';
import { Bundle, Patient, Practitioner, QuestionnaireResponse } from 'fhir/r4b';
import { describe, expect, test, vi } from 'vitest';

import { getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { axiosInstance } from 'aidbox-react/lib/services/instance';

import { ensure, extractBundleResources, WithId, withRootAccess } from '@beda.software/fhir-react';

import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import { createPatient, createPractitionerRole, loginAdminUser, waitForAPIProcess } from 'src/setupTests';
import { ThemeProvider } from 'src/theme';

describe('Draft questionnaire response saves correctly', async () => {
    async function setup() {
        await loginAdminUser();
        return await withRootAccess(axiosInstance, async () => {
            const patient = await createPatient({
                name: [{ given: ['John'], family: 'Smith' }],
            });

            const { practitioner, practitionerRole } = await createPractitionerRole({});

            return { patient, practitioner, practitionerRole };
        });
    }

    async function renderForm(patient: Patient, practitioner: WithId<Practitioner>) {
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
                        questionnaireId="repeatable-group"
                        onSuccess={onSuccess}
                        autosave={true}
                    />
                </I18nProvider>
            </ThemeProvider>,
        );

        return onSuccess;
    }

    test('Test QuestionnaireResponse autosave', async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        await renderForm(patient, practitioner);

        const textField = await screen.findByTestId('repeatable-group-text');
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
                    questionnaire: 'repeatable-group',
                    status: 'in-progress',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });
    }, 60000);

    test('Test QuestionnaireResponse is not duplictated by autosave', async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        const onSuccess = await renderForm(patient, practitioner);

        const textField = await screen.findByTestId('repeatable-group-text');
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
                    questionnaire: 'repeatable-group',
                    _sort: ['-createdAt', '_id'],
                }),
            resolver: (result) => {
                const qrs = extractBundleResources(ensure(result)).QuestionnaireResponse;
                return qrs.length === 1;
            },
        });
    }, 60000);

    test("Test QuestionnaireResponse autosave doesn't reset completed status", async () => {
        const testFieldValue = 'Test 1';

        const { patient, practitioner } = await setup();

        const onSuccess = await renderForm(patient, practitioner);

        const textField = await screen.findByTestId('repeatable-group-text');
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
                    questionnaire: 'repeatable-group',
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
                    questionnaire: 'repeatable-group',
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
