import { QuestionnaireResponse } from 'fhir/r4b';

import { resolveTemplate } from '../utils/extract';

const qr: QuestionnaireResponse = {
    resourceType: 'QuestionnaireResponse',
    status: 'completed',
    item: [
        {
            linkId: 'name',
            item: [
                {
                    linkId: 'last-name',
                    answer: [
                        {
                            valueString: 'Beda',
                        },
                    ],
                },
                {
                    linkId: 'first-name',
                    answer: [
                        {
                            valueString: 'Ilya',
                        },
                    ],
                },
                {
                    linkId: 'middle-name',
                    answer: [
                        {
                            valueString: 'Alekseevich',
                        },
                    ],
                },
            ],
        },
        {
            linkId: 'birth-date',
            answer: [
                {
                    valueDate: '2023-05-01',
                },
            ],
        },
        {
            linkId: 'gender',
            answer: [
                {
                    valueCoding: { code: 'male' },
                },
            ],
        },
        {
            linkId: 'ssn',
            answer: [
                {
                    valueString: '123',
                },
            ],
        },
        {
            linkId: 'mobile',
            answer: [
                {
                    valueString: '11231231231',
                },
            ],
        },
    ],
};

const template1 = {
    resourceType: 'Patient',
    name: [
        {
            family: "{{ QuestionnaireResponse.repeat(item).where(linkId='last-name').answer.value }}",
            given: [
                "{{ QuestionnaireResponse.repeat(item).where(linkId='first-name').answer.value }}",
                "{{ QuestionnaireResponse.repeat(item).where(linkId='middle-name').answer.value }}",
            ],
        },
    ],
    birthDate: "{{ QuestionnaireResponse.item.where(linkId='birth-date').answer.value }}",
    gender: "{{ QuestionnaireResponse.item.where(linkId='gender').answer.valueCoding.code }}",
    telecom: [
        {
            system: 'phone',
            value: "{{ QuestionnaireResponse.item.where(linkId='mobile').answer.value }}",
        },
    ],
    identifier: [
        {
            system: 'http://hl7.org/fhir/sid/us-ssn',
            value: "{{ QuestionnaireResponse.item.where(linkId='ssn').answer.value }}",
        },
    ],
};

const template2 = {
    resourceType: 'Patient',
    name: {
        "{{ QuestionnaireResponse.item.where(linkId='name') }}": {
            family: "{{ item.where(linkId='last-name').answer.valueString }}",
            given: [
                "{{ item.where(linkId='first-name').answer.valueString }}",
                "{{ item.where(linkId='middle-name').answer.valueString }}",
            ],
        },
    },
    birthDate: "{{ QuestionnaireResponse.item.where(linkId='birth-date').answer.value }}",
    gender: "{{ QuestionnaireResponse.item.where(linkId='gender').answer.valueCoding.code }}",
    telecom: [
        {
            system: 'phone',
            value: "{{ QuestionnaireResponse.item.where(linkId='mobile').answer.value }}",
        },
    ],
    identifier: [
        {
            system: 'http://hl7.org/fhir/sid/us-ssn',
            value: "{{ QuestionnaireResponse.item.where(linkId='ssn').answer.value }}",
        },
    ],
};

const result = {
    birthDate: '2023-05-01',
    gender: 'male',
    identifier: [
        {
            system: 'http://hl7.org/fhir/sid/us-ssn',
            value: '123',
        },
    ],
    name: [
        {
            family: 'Beda',
            given: ['Ilya', 'Alekseevich'],
        },
    ],
    resourceType: 'Patient',
    telecom: [
        {
            system: 'phone',
            value: '11231231231',
        },
    ],
};

describe('Extraction', () => {
    test('Simple transformation', () => {
        expect(resolveTemplate(qr, template1)).toStrictEqual(result);
    });
    test('List transformation', () => {
        expect(resolveTemplate(qr, template2)).toStrictEqual(result);
    });
});
