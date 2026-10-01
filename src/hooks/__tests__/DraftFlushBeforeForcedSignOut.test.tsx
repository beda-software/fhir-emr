import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { screen, render, act } from '@testing-library/react';
import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { ensure, extractBundleResources, getReference, WithId, withRootAccess } from '@beda.software/fhir-react';

import { inputText } from 'src/__tests__/sdc-helpers';
import { IdleTimeout } from 'src/components/IdleTimeout';
import { flushActiveDraftBestEffort } from 'src/components/IdleTimeout/utils';
import { PatientDocument } from 'src/containers/PatientDetails/PatientDocument';
import { doLogout } from 'src/services/auth';
import { axiosInstance, getFHIRResources, updateFHIRResource } from 'src/services/fhir';
import { createPatient, createPractitionerRole, loginAdminUser } from 'src/setupTests';
import { ThemeProvider } from 'src/theme';

// Only the end of the Session is stubbed (jsdom cannot navigate); the token check stays truthy
// because setupTests stubs localStorage, which getToken() reads.
vi.mock('src/services/auth', async (importOriginal) => ({
    ...(await importOriginal<typeof import('src/services/auth')>()),
    doLogout: vi.fn().mockResolvedValue(undefined),
    getToken: () => 'test-token',
}));

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const RECHECK_INTERVAL_MS = 5000;

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
    test('a Forced Sign-Out caused by the Idle Timeout elapsing persists the open Questionnaire Draft first', async () => {
        const testFieldValue = 'in-progress visit note';

        const { patient, practitioner } = await setup();

        act(() => {
            i18n.activate('en');
        });

        // Installed before mount so the Idle Timeout's recheck interval is the faked one; only the
        // interval and the clock are faked, so HTTP and userEvent keep running on real timers.
        vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'], now: Date.now() });

        render(
            <MemoryRouter>
                <ThemeProvider>
                    <I18nProvider i18n={i18n}>
                        <IdleTimeout />
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
                </ThemeProvider>
            </MemoryRouter>,
        );

        const textField = await screen.findByTestId(questionnaireLinkId);
        expect(textField).toBeEnabled();

        await inputText(questionnaireLinkId, testFieldValue);

        const draftsOnServer = async () =>
            extractBundleResources(
                ensure(
                    await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                        questionnaire: questionnaireId,
                        status: 'in-progress',
                        _sort: ['-createdAt', '_id'],
                    }),
                ),
            ).QuestionnaireResponse;

        expect(await draftsOnServer()).toHaveLength(0);

        // Drafts the server held at the moment the Session was ended.
        let draftsAtSignOut: QuestionnaireResponse[] | undefined;
        vi.mocked(doLogout).mockImplementationOnce(async () => {
            draftsAtSignOut = await draftsOnServer();
        });

        try {
            await act(async () => {
                vi.advanceTimersByTime(IDLE_TIMEOUT_MS + RECHECK_INTERVAL_MS);
            });
        } finally {
            vi.useRealTimers();
        }

        await vi.waitFor(() => expect(doLogout).toHaveBeenCalledWith('forced'), { timeout: 15000 });
        await vi.waitFor(() => expect(draftsAtSignOut).toBeDefined());

        expect(draftsAtSignOut).toHaveLength(1);
        expect(draftsAtSignOut![0]!.status).toBe('in-progress');
        expect(draftsAtSignOut![0]!.subject!.reference).toBe(getReference(patient).reference);
        expect(draftsAtSignOut![0]!.item?.[0]?.answer?.[0]?.valueString).toBe(testFieldValue);
    }, 60000);

    test('the flush is a no-op when no Questionnaire Draft form is currently open', async () => {
        await expect(flushActiveDraftBestEffort()).resolves.toBeUndefined();
    });
});
