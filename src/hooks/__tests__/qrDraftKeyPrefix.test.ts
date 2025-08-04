import { Patient, Questionnaire, QuestionnaireResponse, Reference } from 'fhir/r4b';
import { describe, expect, test } from 'vitest';

import { WithId } from '@beda.software/fhir-react';

import {
    makeReference,
    makeDraftKeyPrefix,
    makeLocalStorageDraftVersionedKey,
    extractDraftUnversionedKey,
} from 'src/hooks/useQuestionnaireResponseDraft';
import { createPatient, loginAdminUser } from 'src/setupTests';

describe('makeReference', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('makeReference should return string as Reference', () => {
        const draftId = 'Patient/patient1';
        const draftIdRef: Reference = {
            reference: draftId,
        };
        expect(makeReference(draftId)).toEqual(draftIdRef);
    });

    test('makeReference should return Reference when given Reference', () => {
        const draftId = 'Patient/patient1';
        const draftIdRef: Reference = {
            reference: draftId,
        };
        expect(makeReference(draftIdRef)).toEqual(draftIdRef);
    });

    test('makeReference should return Reference when given Resource', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const draftIdRef: Reference = {
            reference: `Patient/${patient.id}`,
        };
        expect(makeReference(patient)).toEqual(draftIdRef);
    });
});

describe('makeDraftKeyPrefix', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('makeDraftKeyPrefix should return undefined when nothing provided', async () => {
        expect(makeDraftKeyPrefix({})).toBeUndefined();
    });

    test('makeDraftKeyPrefix should return questionnaireResponseId when it is defined and provided', async () => {
        const questionnaireResponseId = 'some-qr-uuid';
        const questionnaireResponse: WithId<QuestionnaireResponse> = {
            resourceType: 'QuestionnaireResponse',
            id: questionnaireResponseId,
            status: 'completed',
        };
        const draftKeyPrefix = `QuestionnaireResponse/${questionnaireResponseId}`;

        expect(makeDraftKeyPrefix({ questionnaireResponse })).toEqual(draftKeyPrefix);
    });

    test('makeDraftKeyPrefix should return questionnaireResponseId when it is defined and provided even with other fields', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const questionnaireResponseId = 'some-qr-uuid';
        const questionnaireResponse: WithId<QuestionnaireResponse> = {
            resourceType: 'QuestionnaireResponse',
            id: questionnaireResponseId,
            status: 'completed',
        };
        const draftKeyPrefix = `QuestionnaireResponse/${questionnaireResponseId}`;

        expect(
            makeDraftKeyPrefix({
                draftKeySubject: patient,
                questionnaireResponse,
            }),
        ).toEqual(draftKeyPrefix);
        expect(
            makeDraftKeyPrefix({
                draftKeySubject: patient,
                questionnaireResponse,
            }),
        ).toEqual(draftKeyPrefix);
    });

    test('makeDraftKeyPrefix should return patientReference when it is defined and questionnaireResponseId is undefined', async () => {
        const patient = await createPatient({
            name: [{ given: ['John'], family: 'Smith' }],
        });

        const draftKeyPrefix = `Patient/${patient.id}`;

        expect(makeDraftKeyPrefix({ draftKeySubject: patient })).toEqual(draftKeyPrefix);
    });
});

describe('makeLocalStorageDraftVersionedKey', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    test('makeLocalStorageDraftVersionedKey should return undefined when nothing provided', async () => {
        expect(makeLocalStorageDraftVersionedKey({})).toBeUndefined();
    });

    test('makeLocalStorageDraftVersionedKey should return draft|Patient/patient1|Questionnaire/questionnaire1|1 when provided with patient and questionnaire', async () => {
        const patient: Patient = {
            resourceType: 'Patient',
            id: 'patient-john-smith',
            name: [{ given: ['John'], family: 'Smith' }],
        };

        const questionnaire: WithId<Questionnaire> = {
            resourceType: 'Questionnaire',
            status: 'active',
            name: 'questionnaire-1',
            id: 'questionnaire-1',
            meta: {
                versionId: '1',
            },
        };

        const draftKey = makeLocalStorageDraftVersionedKey({
            subject: patient,
            questionnaire,
        });

        expect(draftKey).toBeDefined();
        expect(draftKey).toBe('draft|Patient/patient-john-smith|Questionnaire/questionnaire-1|1');
        expect(extractDraftUnversionedKey(draftKey!)).toBe(
            'draft|Patient/patient-john-smith|Questionnaire/questionnaire-1',
        );
    });
});
