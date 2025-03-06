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

type WizardGroup = {
    linkId: string;
    required: boolean;
};
const WIZARD_GROUPS: WizardGroup[] = [
    { linkId: 'group-1', required: true },
    { linkId: 'group-2', required: false },
    { linkId: 'group-3', required: true },
    { linkId: 'group-4', required: false },
];

describe('WizardGroup renders correctly', async () => {
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

    async function renderWizardGroupForm(patient: Patient, practitioner: WithId<Practitioner>) {
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
                        questionnaireId="group-wizard-test"
                        onSuccess={onSuccess}
                    />
                </I18nProvider>
            </ThemeProvider>,
        );

        return onSuccess;
    }

    test('Test only steps with errors are invalid', async () => {
        const { patient, practitioner } = await setup();

        await renderWizardGroupForm(patient, practitioner);

        const stepsIcons = [];
        for (const group of WIZARD_GROUPS) {
            stepsIcons.push(await screen.findByTestId(`wizard-step-icon-${group.linkId}`));
        }

        expect(stepsIcons).toHaveLength(WIZARD_GROUPS.length);

        const lastStepIcon = stepsIcons[stepsIcons.length - 1];
        expect(lastStepIcon).toBeDefined();

        act(() => {
            fireEvent.click(lastStepIcon!);
        });

        const submitButton = await screen.findByTestId('submit-button');

        act(() => {
            fireEvent.click(submitButton);
        });

        for (const [stepIconIndex, stepIcon] of stepsIcons.entries()) {
            const wizardGroup = WIZARD_GROUPS[stepIconIndex]!;

            await waitFor(() => {
                const stepHasError =
                    stepIcon.parentElement?.parentElement?.parentElement?.parentElement?.className.includes(
                        'ant-steps-item-error',
                    );

                expect(stepHasError).toBe(wizardGroup.required ? true : false);
            });
        }
    }, 60000);
});
