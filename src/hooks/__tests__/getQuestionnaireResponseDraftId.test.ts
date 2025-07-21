import { Reference } from 'fhir/r4b';
import { describe, expect, test } from 'vitest';

import {
    generateReferenceFromResourceReferenceString,
    getQuestionnaireResponseDraftId,
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

describe('getQuestionnaireResponseDraftId', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('getQuestionnaireResponseDraftId should return undefined when nothing provided', async () => {
        expect(getQuestionnaireResponseDraftId({ qrDraftServiceType: 'local' })).toBeUndefined();
    });

    test('getQuestionnaireResponseDraftId should return questionnaireResponseId when it is defined and provided', async () => {
        const questionnaireResponseId = 'some-qr-uuid';

        expect(getQuestionnaireResponseDraftId({ qrDraftServiceType: 'local', questionnaireResponseId })).toEqual(
            questionnaireResponseId,
        );
    });

    test('getQuestionnaireResponseDraftId should return questionnaireResponseId when it is defined and provided even with other fields', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const questionnaireId = 'some-questionnaire-id';
        const questionnaireResponseId = 'some-qr-uuid';

        expect(
            getQuestionnaireResponseDraftId({
                qrDraftServiceType: 'local',
                subject: patient,
                questionnaireId,
                questionnaireResponseId,
            }),
        ).toEqual(questionnaireResponseId);
    });

    test('getQuestionnaireResponseDraftId should return patientReference/questionnaireId when it is defined and questionnaireResponseId is undefined', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const questionnaireId = 'some-questionnaire-id';

        const draftId = `Patient/${patient.id}/${questionnaireId}`;

        expect(
            getQuestionnaireResponseDraftId({ qrDraftServiceType: 'local', subject: patient, questionnaireId }),
        ).toEqual(draftId);
    });

    test('getQuestionnaireResponseDraftId should return undefined when questionnaireResponseId is undefined and subject is undefined', async () => {
        const questionnaireId = 'some-questionnaire-id';

        expect(getQuestionnaireResponseDraftId({ qrDraftServiceType: 'local', questionnaireId })).toBeUndefined();
    });

    test('getQuestionnaireResponseDraftId should return undefined when questionnaireResponseId is undefined and questionnaireId is undefined', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        expect(getQuestionnaireResponseDraftId({ qrDraftServiceType: 'local', subject: patient })).toBeUndefined();
    });
});
