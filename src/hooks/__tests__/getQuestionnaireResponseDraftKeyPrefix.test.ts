import { Reference } from 'fhir/r4b';
import { describe, expect, test } from 'vitest';

import {
    generateReferenceFromResourceReferenceString,
    getQuestionnaireResponseDraftKeyPrefix,
} from 'src/hooks/useQuestionnaireResponseDraft';
import { createPatient, loginAdminUser } from 'src/setupTests';

describe('convertToReference', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('convertToReference should return undefined when given undefined', () => {
        expect(generateReferenceFromResourceReferenceString()).toBeUndefined();
    });

    test('convertToReference should return string as Reference', () => {
        const draftId = 'Patient/patient1';
        const draftIdRef: Reference = {
            reference: draftId,
        };
        expect(generateReferenceFromResourceReferenceString(draftId)).toEqual(draftIdRef);
    });

    test('convertToReference should return Reference when given Reference', () => {
        const draftId = 'Patient/patient1';
        const draftIdRef: Reference = {
            reference: draftId,
        };
        expect(generateReferenceFromResourceReferenceString(draftIdRef)).toEqual(draftIdRef);
    });

    test('convertToReference should return Reference when given Resource', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const draftIdRef: Reference = {
            reference: `Patient/${patient.id}`,
        };
        expect(generateReferenceFromResourceReferenceString(patient)).toEqual(draftIdRef);
    });
});

describe('getQuestionnaireResponseDraftKeyPrefix', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('getQuestionnaireResponseDraftId should return undefined when nothing provided', async () => {
        expect(getQuestionnaireResponseDraftKeyPrefix({ qrDraftServiceType: 'local' })).toBeUndefined();
        expect(getQuestionnaireResponseDraftKeyPrefix({ qrDraftServiceType: 'server' })).toBeUndefined();
    });

    test('getQuestionnaireResponseDraftId should return questionnaireResponseId when it is defined and provided', async () => {
        const questionnaireResponseId = 'some-qr-uuid';
        const draftKeyPrefix = `QuestionnaireResponse/${questionnaireResponseId}`;

        expect(
            getQuestionnaireResponseDraftKeyPrefix({ qrDraftServiceType: 'local', questionnaireResponseId }),
        ).toEqual(draftKeyPrefix);
        expect(
            getQuestionnaireResponseDraftKeyPrefix({ qrDraftServiceType: 'server', questionnaireResponseId }),
        ).toEqual(questionnaireResponseId);
    });

    test('getQuestionnaireResponseDraftId should return questionnaireResponseId when it is defined and provided even with other fields', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const questionnaireResponseId = 'some-qr-uuid';
        const draftKeyPrefix = `QuestionnaireResponse/${questionnaireResponseId}`;

        expect(
            getQuestionnaireResponseDraftKeyPrefix({
                qrDraftServiceType: 'local',
                subject: patient,
                questionnaireResponseId,
            }),
        ).toEqual(draftKeyPrefix);
        expect(
            getQuestionnaireResponseDraftKeyPrefix({
                qrDraftServiceType: 'server',
                subject: patient,
                questionnaireResponseId,
            }),
        ).toEqual(questionnaireResponseId);
    });

    test('getQuestionnaireResponseDraftId should return patientReference when it is defined and questionnaireResponseId is undefined', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const draftKeyPrefix = `Patient/${patient.id}`;

        expect(getQuestionnaireResponseDraftKeyPrefix({ qrDraftServiceType: 'local', subject: patient })).toEqual(
            draftKeyPrefix,
        );
        expect(
            getQuestionnaireResponseDraftKeyPrefix({ qrDraftServiceType: 'server', subject: patient }),
        ).toBeUndefined();
    });
});
