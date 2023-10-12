import { Questionnaire } from 'fhir/r4b';

import { prepareQuestionnaire } from '../utils';

describe('prepare questionnaire', () => {
    test('Empty', () => {
        const q: Questionnaire = {
            resourceType: 'Questionnaire',
            status: 'draft',
        };
        expect(prepareQuestionnaire(q)).toStrictEqual(q);
    });
    test('Patient', () => {
        const q: Questionnaire = {
            resourceType: 'Questionnaire',
            status: 'draft',
            subjectType: ['Patient'],
        };
        const result = prepareQuestionnaire(q);
        expect(result.item?.length).toBe(1);
        expect(result.extension?.length).toBe(1);
    });
    test('Encounter', () => {
        const q: Questionnaire = {
            resourceType: 'Questionnaire',
            status: 'draft',
            subjectType: ['Encounter'],
        };
        const result = prepareQuestionnaire(q);
        expect(result.item?.length).toBe(2);
        expect(result.extension?.length).toBe(2);
    });
    test('Idempotency', () => {
        const q: Questionnaire = {
            resourceType: 'Questionnaire',
            status: 'draft',
            subjectType: ['Patient', 'Encounter'],
        };
        const result = prepareQuestionnaire(prepareQuestionnaire(q));
        expect(result.item?.length).toBe(2);
        expect(result.extension?.length).toBe(2);
    });
});
