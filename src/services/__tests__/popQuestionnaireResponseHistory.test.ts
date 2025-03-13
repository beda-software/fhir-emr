import { waitFor } from '@testing-library/react';
import { QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import type { QuestionnaireResponseItemAnswerValue } from 'shared/src/contrib/aidbox';
import { describe, expect } from 'vitest';

import { getReference } from '@beda.software/fhir-react';
import { isFailure, isSuccess } from '@beda.software/remote-data';

import { loadResourceHistory, popQuestionnaireResponseHistory } from 'src/services';
import { saveFHIRResource, getFHIRResource } from 'src/services/fhir';
import { createPatient, createPractitioner, loginAdminUser } from 'src/setupTests';

const ANSWERS: QuestionnaireResponseItemAnswerValue['integer'][] = [1, 2, 3];

describe('popQuestionnaireResponseHistory', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    it('should delete latest QuestionnaireResponse after several edits id', async () => {
        const practitioner = await createPractitioner();
        const patient = await createPatient();

        const qrData: QuestionnaireResponse = {
            questionnaire: 'Questionnaire/test-q',
            item: [
                {
                    text: 'Set year',
                    answer: [
                        {
                            valueInteger: 0,
                        },
                    ],
                    linkId: '1',
                },
            ],
            resourceType: 'QuestionnaireResponse',
            author: {
                reference: getReference(practitioner).reference,
            },
            status: 'completed',
            subject: {
                reference: getReference(patient).reference,
            },
        };

        const qrRD = await saveFHIRResource<QuestionnaireResponse>(qrData);

        if (!isSuccess(qrRD)) {
            return;
        }
        const qrVersions = [qrRD.data.meta?.versionId];
        const qrId = qrRD.data.id;

        for (let index = 0; index < ANSWERS.length; index++) {
            const qrDataEdit: QuestionnaireResponse = {
                ...qrData,
                id: qrId,
                item: [
                    {
                        text: 'Set year',
                        answer: [
                            {
                                valueInteger: ANSWERS[index],
                            },
                        ],
                        linkId: '1',
                    },
                ],
            };
            const qrRDEdit = await saveFHIRResource<QuestionnaireResponse>(qrDataEdit);

            if (isSuccess(qrRDEdit)) {
                qrVersions.push(qrRDEdit.data.meta?.versionId);
            }
        }

        expect(_.uniqBy(qrVersions, (item) => item).length).toBe(4);
        const historyRD = await loadResourceHistory<QuestionnaireResponse>({
            reference: `QuestionnaireResponse/${qrId}`,
        });
        await waitFor(() => {
            expect(isSuccess(historyRD)).toBeTruthy();
        });
        if (isSuccess(historyRD)) {
            expect(historyRD.data?.total).toBe(4);
        }

        await popQuestionnaireResponseHistory(qrId);

        const historyRD_2 = await loadResourceHistory<QuestionnaireResponse>({
            reference: `QuestionnaireResponse/${qrId}`,
        });
        await waitFor(() => {
            expect(isSuccess(historyRD_2)).toBeTruthy();
        });
        if (isSuccess(historyRD_2)) {
            expect(historyRD_2.data?.total).toBe(3);
        }

        const qrCurrent = await getFHIRResource<QuestionnaireResponse>({
            reference: `QuestionnaireResponse/${qrId}`,
        });

        await waitFor(() => {
            expect(isSuccess(qrCurrent)).toBeTruthy();
        });
        if (isSuccess(qrCurrent)) {
            expect(qrCurrent.data?.meta?.versionId).toBe(qrVersions[2]);
        }
    });

    it('should delete newly created QuestionnaireResponse', async () => {
        const practitioner = await createPractitioner();
        const patient = await createPatient();

        const qrData: QuestionnaireResponse = {
            questionnaire: 'Questionnaire/test-q',
            item: [
                {
                    text: 'Set year',
                    answer: [
                        {
                            valueInteger: 0,
                        },
                    ],
                    linkId: '1',
                },
            ],
            resourceType: 'QuestionnaireResponse',
            author: {
                reference: getReference(practitioner).reference,
            },
            status: 'completed',
            subject: {
                reference: getReference(patient).reference,
            },
        };

        const qrRD = await saveFHIRResource<QuestionnaireResponse>(qrData);

        if (!isSuccess(qrRD)) {
            return;
        }
        const qrId = qrRD.data.id;

        const historyRD = await loadResourceHistory<QuestionnaireResponse>({
            reference: `QuestionnaireResponse/${qrId}`,
        });
        await waitFor(() => {
            expect(isSuccess(historyRD)).toBeTruthy();
        });
        if (isSuccess(historyRD)) {
            expect(historyRD.data?.total).toBe(1);
        }

        await popQuestionnaireResponseHistory(qrId);

        const historyRD_2 = await loadResourceHistory<QuestionnaireResponse>({
            reference: `QuestionnaireResponse/${qrId}`,
        });
        await waitFor(() => {
            expect(isSuccess(historyRD_2)).toBeTruthy();
        });
        if (isSuccess(historyRD_2)) {
            expect(historyRD_2.data?.total).toBe(0);
        }

        const qrCurrent = await getFHIRResource<QuestionnaireResponse>({
            reference: `QuestionnaireResponse/${qrId}`,
        });

        await waitFor(() => {
            expect(isFailure(qrCurrent)).toBeTruthy();
        });
    });
});
