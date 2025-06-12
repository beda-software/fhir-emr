import { Reference } from 'fhir/r4b';
import { describe, expect, test } from 'vitest';

import { createPatient, loginAdminUser } from 'src/setupTests';

import { convertToReference, getQuestionnaireResponseDraftId } from '../utils';

describe('convertToReference', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('convertToReference should return undefined when given undefined', () => {
        expect(convertToReference()).toBeUndefined();
    });

    test('convertToReference should return string as Reference', () => {
        const draftId = 'Patient/patient1';
        const draftIdRef: Reference = {
            reference: draftId,
        };
        expect(convertToReference(draftId)).toEqual(draftIdRef);
    });

    test('convertToReference should return Reference when given Reference', () => {
        const draftId = 'Patient/patient1';
        const draftIdRef: Reference = {
            reference: draftId,
        };
        expect(convertToReference(draftIdRef)).toEqual(draftIdRef);
    });

    test('convertToReference should return Reference when given Resource', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const draftIdRef: Reference = {
            reference: `Patient/${patient.id}`,
        };
        expect(convertToReference(patient)).toEqual(draftIdRef);
    });
});

describe('getQuestionnaireResponseDraftId', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('getQuestionnaireResponseDraftId should return undefined when nothing provided', async () => {
        expect(getQuestionnaireResponseDraftId({})).toBeUndefined();
    });

    test('getQuestionnaireResponseDraftId should return questionnaireResponseId when it is defined and provided', async () => {
        const questionnaireResponseId = 'some-qr-uuid';

        expect(getQuestionnaireResponseDraftId({ questionnaireResponseId })).toEqual(questionnaireResponseId);
    });

    test('getQuestionnaireResponseDraftId should return questionnaireResponseId when it is defined and provided even with other fields', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const questionnaireId = 'some-questionnaire-id';
        const questionnaireResponseId = 'some-qr-uuid';

        expect(getQuestionnaireResponseDraftId({ subject: patient, questionnaireId, questionnaireResponseId })).toEqual(
            questionnaireResponseId,
        );
    });

    test('getQuestionnaireResponseDraftId should return patientReference/questionnaireId when it is defined and questionnaireResponseId is undefined', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const questionnaireId = 'some-questionnaire-id';

        const draftId = `Patient/${patient.id}/${questionnaireId}`;

        expect(getQuestionnaireResponseDraftId({ subject: patient, questionnaireId })).toEqual(draftId);
    });

    test('getQuestionnaireResponseDraftId should return undefined when questionnaireResponseId is undefined and subject is undefined', async () => {
        const questionnaireId = 'some-questionnaire-id';

        expect(getQuestionnaireResponseDraftId({ questionnaireId })).toBeUndefined();
    });

    test('getQuestionnaireResponseDraftId should return undefined when questionnaireResponseId is undefined and questionnaireId is undefined', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        expect(getQuestionnaireResponseDraftId({ subject: patient })).toBeUndefined();
    });
});
