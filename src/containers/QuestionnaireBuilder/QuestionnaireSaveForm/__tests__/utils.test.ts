import { Questionnaire } from 'fhir/r4b';
import _ from 'lodash';
import { evaluate } from 'src/utils';

import { launchContextUrl, prepareQuestionnaire } from '../utils';

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
    test('Remove Encounter: encounterId and Encounter launchContext are removed', () => {
        const q: Questionnaire = {
            resourceType: 'Questionnaire',
            status: 'draft',
            subjectType: ['Patient', 'Encounter'],
            item: [
                {
                    linkId: 'patientId',
                    text: 'PatientId',
                    type: 'string',
                },
                {
                    linkId: 'encounterId',
                    text: 'EncounterId',
                    type: 'string',
                },
            ],
            extension: [
                {
                    url: launchContextUrl,
                    extension: [
                        {
                            url: 'name',
                            valueCoding: { code: 'Patient' },
                        },
                        {
                            url: 'type',
                            valueCode: 'Patient',
                        },
                    ],
                },
                {
                    url: launchContextUrl,
                    extension: [
                        {
                            url: 'name',
                            valueCoding: { code: 'Encounter' },
                        },
                        {
                            url: 'type',
                            valueCode: 'Encounter',
                        },
                    ],
                },
            ],
        };
        const result = prepareQuestionnaire({ ...q, subjectType: ['Patient'] });
        expect(result.item?.find((i) => i.linkId === 'encounterId')).toBeUndefined();
        expect(
            evaluate(
                { extension: result.extension },
                `extension.where(url='${launchContextUrl}').extension.where(url='name').valueCoding.where(code='Encounter')`,
            ).length,
        ).toBe(0);
        expect(result.item?.find((i) => i.linkId === 'patientId')).toBeDefined();
        expect(
            evaluate(
                { extension: result.extension },
                `extension.where(url='${launchContextUrl}').extension.where(url='name').valueCoding.where(code='Patient')`,
            ).length,
        ).toBeGreaterThan(0);
    });
});
