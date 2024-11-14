import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { screen, render, waitFor, fireEvent, act } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';

import { AllergyIntolerance } from '@beda.software/aidbox-types';
import { ensure, withRootAccess } from '@beda.software/fhir-react';

import { chooseInlineOption, inputText } from 'src/__tests__/sdc-helpers';
import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import { axiosInstance } from 'src/services/fhir';
import { createPatient, loginAdminUser } from 'src/setupTests';

test('Test allergies patient form filling and extraction', async () => {
    await loginAdminUser();
    const { patient } = await withRootAccess(axiosInstance, async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        return { patient };
    });

    const onSuccess = vi.fn();
    act(() => {
        i18n.activate('en');
    });

    render(
        <I18nProvider i18n={i18n}>
            <PatientDocument patient={patient} author={patient} questionnaireId="allergies" onSuccess={onSuccess} />
        </I18nProvider>,
    );

    await chooseInlineOption('type', 'Food');
    await chooseInlineOption('reaction', 'Headache');
    await chooseInlineOption('substance-food', 'Eggs');
    await inputText('notes', 'Notes');

    fireEvent.click(screen.getByTestId('submit-button'));

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
