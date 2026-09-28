import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { screen, render, waitFor, fireEvent, act } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import { AllergyIntolerance } from '@beda.software/aidbox-types';
import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { extractBundleResources, ensure, withRootAccess } from '@beda.software/fhir-react';

import { chooseInlineOption, inputText } from 'src/__tests__/sdc-helpers';
import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import { axiosInstance, getFHIRResources } from 'src/services/fhir';
import { createPatient, createPractitioner, loginAdminUser } from 'src/setupTests';
import { ThemeProvider } from 'src/theme';

describe('Test allergies patient form filling and extraction', () => {
    test('Test allergies patient form filling and extraction', async () => {
        await loginAdminUser();
        const { patient } = await withRootAccess(axiosInstance, async () => {
            const patient = await createPatient({
                name: [{ given: ['John'], family: 'Smith' }],
            });

            return { patient };
        });
        const practitioner = await createPractitioner({ name: [{ given: ['John'], family: 'Smith' }] });

        const onSuccess = vi.fn();
        act(() => {
            i18n.activate('en');
        });

        render(
            <ThemeProvider>
                <I18nProvider i18n={i18n}>
                    <ClinicalContext
                        context={[
                            { name: 'Author', resource: practitioner },
                            { name: 'Patient', resource: patient },
                        ]}
                    >
                        <PatientDocument questionnaireId="allergies" onSuccess={onSuccess} autoSave={false} />
                    </ClinicalContext>
                </I18nProvider>
            </ThemeProvider>,
        );

        await chooseInlineOption('type', 'Food');
        await chooseInlineOption('reaction', 'Headache');
        await chooseInlineOption('substance-food', 'Eggs');
        await inputText('notes', 'Notes');

        act(() => {
            fireEvent.click(screen.getByTestId('submit-button'));
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());

        await withRootAccess(axiosInstance, async () => {
            const allergyIntoleranceList = await waitFor(async () => {
                const allergyIntoleranceResponse = await getFHIRResources<AllergyIntolerance>('AllergyIntolerance', {
                    patient: `Patient/${patient.id}`,
                });
                return extractBundleResources(ensure(allergyIntoleranceResponse)).AllergyIntolerance;
            });

            expect(allergyIntoleranceList.length).toBe(1);

            expect(allergyIntoleranceList[0]?.category?.[0]).toBe('food');
            expect(allergyIntoleranceList[0]?.code?.coding?.[0]).toMatchObject({
                code: '102263004',
                display: 'Eggs',
            });
            expect(allergyIntoleranceList[0]?.reaction?.[0]?.manifestation?.[0]?.coding?.[0]).toMatchObject({
                code: '25064002',
                display: 'Headache',
            });
        });
    }, 60000);
});
