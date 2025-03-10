import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { screen, render, act, fireEvent, waitFor } from '@testing-library/react';
import { Patient, Practitioner } from 'fhir/r4b';
import { expect, test, vi } from 'vitest';

import { axiosInstance } from 'aidbox-react/lib/services/instance';

import { WithId, withRootAccess } from '@beda.software/fhir-react';

import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import { createPatient, createPractitionerRole, loginAdminUser } from 'src/setupTests';
import { ThemeProvider } from 'src/theme';

import { ProcedureCase } from './types';

const CASE: ProcedureCase = {
    case: [
        {
            text: 'Test 1',
        },
        {
            text: 'Test 2',
        },
        {
            text: 'Test 3',
        },
        {
            text: 'Test 4',
        },
        {
            text: 'Test 5',
        },
    ],
};

describe('Repeatable group creates correct questionnaire response', async () => {
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

    async function renderRepeatableGroupForm(patient: Patient, practitioner: WithId<Practitioner>) {
        const onSuccess = vi.fn();

        act(() => {
            i18n.activate('en');
        });

        const renderer = render(
            <ThemeProvider>
                <I18nProvider i18n={i18n}>
                    <PatientDocument
                        patient={patient}
                        author={practitioner}
                        questionnaireId="repeatable-group"
                        onSuccess={onSuccess}
                    />
                </I18nProvider>
            </ThemeProvider>,
        );

        return { onSuccess, renderer };
    }

    test('Test group removes correct item', async () => {
        const { patient, practitioner } = await setup();

        const DELETING_INDEX = 1;

        await renderRepeatableGroupForm(patient, practitioner);

        if (CASE.case.length > 1) {
            const addAnotherAnswerButton = (await screen.findByText('Add another answer')).parentElement!;
            CASE.case.slice(1).forEach(() => {
                act(() => {
                    fireEvent.click(addAnotherAnswerButton);
                });
            });
        }

        const textFields = await screen.findAllByTestId('repeatable-group-text');
        for (const [textFieldIndex, textField] of textFields.entries()) {
            expect(textField).toBeEnabled();

            const textInput = textField.querySelector('input')!;
            act(() => {
                fireEvent.change(textInput, {
                    target: { value: CASE.case[textFieldIndex]!.text },
                });
            });
            const textInput2 = textField.querySelector('input')!;

            await waitFor(() => {
                expect(textInput2.value).toBe(CASE.case[textFieldIndex]!.text);
            });
        }

        const allRemoveButton = await screen.findAllByTestId('remove-group-button');
        const removeButton = allRemoveButton[DELETING_INDEX]!;
        expect(removeButton).toBeEnabled();

        const removingTextField = textFields[DELETING_INDEX]!;
        expect(removingTextField).toBeEnabled();

        act(() => {
            fireEvent.click(removeButton);
        });

        await waitFor(() => {
            expect(removingTextField).not.toBeInTheDocument();
        });

        const textFields2 = await screen.findAllByTestId('repeatable-group-text');
        expect(textFields2).toHaveLength(CASE.case.length - 1);

        const controlCases = CASE.case.filter((_, index) => index !== DELETING_INDEX);

        for (const [textFieldIndex, textField] of textFields2.entries()) {
            const textFieldInput = textField.querySelector('input')!;

            expect(textFieldInput).toBeEnabled();
            expect(textFieldInput.value).toBe(controlCases[textFieldIndex]!.text);
        }
    }, 60000);

    test('Test group removes all items and add again', async () => {
        const { patient, practitioner } = await setup();

        await renderRepeatableGroupForm(patient, practitioner);

        const addAnotherAnswerButton = (await screen.findByText('Add another answer')).parentElement!;

        if (CASE.case.length > 1) {
            CASE.case.slice(1).forEach(() => {
                act(() => {
                    fireEvent.click(addAnotherAnswerButton);
                });
            });
        }

        const textFields = await screen.findAllByTestId('repeatable-group-text');
        for (const [textFieldIndex, textField] of textFields.entries()) {
            expect(textField).toBeEnabled();

            const textInput = textField.querySelector('input')!;
            act(() => {
                fireEvent.change(textInput, {
                    target: { value: CASE.case[textFieldIndex]!.text },
                });
            });
            const textInput2 = textField.querySelector('input')!;

            await waitFor(() => {
                expect(textInput2.value).toBe(CASE.case[textFieldIndex]!.text);
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of textFields) {
            const allRemoveButtons = await screen.findAllByTestId('remove-group-button');
            const removeButton = allRemoveButtons[0]!;

            expect(removeButton).toBeInTheDocument();

            act(() => {
                fireEvent.click(removeButton);
            });

            await waitFor(() => {
                expect(removeButton).not.toBeInTheDocument();
            });
        }

        const textFields2 = screen.queryByTestId('repeatable-group-text');
        expect(textFields2).toBeNull();

        if (CASE.case.length > 1) {
            CASE.case.forEach(() => {
                act(() => {
                    fireEvent.click(addAnotherAnswerButton);
                });
            });
        }

        await waitFor(async () => {
            const textFields3 = await screen.findAllByTestId('repeatable-group-text');
            expect(textFields3).toHaveLength(CASE.case.length);
        });
    }, 60000);
});
