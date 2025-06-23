import { Questionnaire } from 'fhir/r4b';
import _ from 'lodash';

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
                    url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
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
                    url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
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
            (result.extension || []).find(
                (ext) =>
                    ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext' &&
                    _.isArray(ext.extension) &&
                    ext.extension.some((e) => e.url === 'name' && e.valueCoding?.code === 'Encounter'),
            ),
        ).toBeUndefined();
        expect(result.item?.find((i) => i.linkId === 'patientId')).toBeDefined();
        expect(
            (result.extension || []).find(
                (ext) =>
                    ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext' &&
                    _.isArray(ext.extension) &&
                    ext.extension.some((e) => e.url === 'name' && e.valueCoding?.code === 'Patient'),
            ),
        ).toBeDefined();
    });
});
