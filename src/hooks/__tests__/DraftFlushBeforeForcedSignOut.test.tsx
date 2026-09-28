import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { screen, render, act } from '@testing-library/react';
import { Bundle, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { describe, expect, test } from 'vitest';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { ensure, extractBundleResources, getReference, WithId, withRootAccess } from '@beda.software/fhir-react';
import { RemoteDataResult } from '@beda.software/remote-data';

import { inputText } from 'src/__tests__/sdc-helpers';
import { flushActiveDraftBestEffort } from 'src/components/IdleTimeout/utils';
import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import { axiosInstance, getFHIRResources, updateFHIRResource } from 'src/services/fhir';
import { createPatient, createPractitionerRole, loginAdminUser, waitForAPIProcess } from 'src/setupTests';
import { ThemeProvider } from 'src/theme';

const questionnaireId = 'test-idle-flush-q';
const questionnaireLinkId = 'test-idle-flush-q-text';
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

        await updateFHIRResource<WithId<Questionnaire>>(questionnaireDefinition);

        return { patient, practitioner, practitionerRole };
    });
}

describe('Draft flush before a Forced Sign-Out', () => {
    // Calls flushActiveDraftBestEffort() directly rather than waiting out a real Idle
    // Timeout; the timeout/warning/expiry flow itself is covered by IdleTimeoutController unit tests.
    test('the currently open server-persisted Questionnaire Draft is saved by a best-effort flush', async () => {
        const testFieldValue = 'in-progress visit note';

        const { patient, practitioner } = await setup();

        act(() => {
            i18n.activate('en');
        });

        render(
            <ThemeProvider>
                <I18nProvider i18n={i18n}>
                    <ClinicalContext
                        context={[
                            { name: 'Patient', resource: patient },
                            { name: 'Author', resource: practitioner },
                        ]}
                    >
                        <PatientDocument
                            questionnaireId={questionnaireId}
                            autoSave={false}
                            qrDraftServiceType="server"
                        />
                    </ClinicalContext>
                </I18nProvider>
            </ThemeProvider>,
        );

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        await inputText(questionnaireLinkId, testFieldValue);

        // autoSave is off, so nothing is on the server before the flush.
        const beforeFlush = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
            questionnaire: questionnaireId,
            status: 'in-progress',
        });
        expect(extractBundleResources(ensure(beforeFlush)).QuestionnaireResponse.length).toBe(0);

        await flushActiveDraftBestEffort();

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

        const afterFlush = ensure(
            await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                questionnaire: questionnaireId,
                status: 'in-progress',
                _sort: ['-createdAt', '_id'],
            }),
        );
        const qrs = extractBundleResources(afterFlush).QuestionnaireResponse;

        expect(qrs.length).toBe(1);
        expect(qrs[0]!.status).toBe('in-progress');
        expect(qrs[0]!.subject!.reference).toBe(getReference(patient).reference);
        expect(qrs[0]!.item?.[0]?.answer?.[0]?.valueString).toBe(testFieldValue);
    }, 60000);

    test('the flush is a no-op when no Questionnaire Draft form is currently open', async () => {
        await expect(flushActiveDraftBestEffort()).resolves.toBeUndefined();
    });
});
