import { getFormDataDiff } from '../utils';

describe('getFormDataDiff utils test', () => {
    test('getFormDataDiff works correctly with no prev data', async () => {
        const currentData = currentData1;
        const prevData = prevData1;

        expect(getFormDataDiff(currentData, prevData)).toEqual(result1);
    });

    test('getFormDataDiff works correctly with deleted data', async () => {
        const currentData = currentData2;
        const prevData = prevData2;

        expect(getFormDataDiff(currentData, prevData)).toEqual(result2);
    });

    test('getFormDataDiff works correctly with mixed data', async () => {
        const currentData = currentData3;
        const prevData = prevData3;

        expect(getFormDataDiff(currentData, prevData)).toEqual(result3);
    });
});

const currentData1 = {
    type: [
        {
            question: 'Type',
            value: {
                Coding: {
                    code: '418634005',
                    system: 'http://hl7.org/fhir/allergy-intolerance-category',
                    display: 'Drug',
                },
            },
            items: {},
        },
    ],
    reaction: [
        {
            question: 'Reaction',
            value: {
                Coding: {
                    code: '39579001',
                    system: 'http://snomed.ct',
                    display: 'Anaphylaxis',
                },
            },
            items: {},
        },
    ],
    'substance-drug': [
        {
            question: 'Substance',
            value: {
                Coding: {
                    code: 'LA26702-3',
                    system: 'http://loinc.org',
                    display: 'Aspirin',
                },
            },
            items: {},
        },
    ],
    notes: [
        {
            question: 'Notes',
            value: {},
            items: {},
        },
    ],
};
const prevData1 = {};
const result1 = {
    diffBefore: {},
    diffAfter: {
        type: [
            {
                question: 'Type',
                value: {
                    Coding: {
                        code: '418634005',
                        system: 'http://hl7.org/fhir/allergy-intolerance-category',
                        display: 'Drug',
                    },
                },
                items: {},
            },
        ],
        reaction: [
            {
                question: 'Reaction',
                value: {
                    Coding: {
                        code: '39579001',
                        system: 'http://snomed.ct',
                        display: 'Anaphylaxis',
                    },
                },
                items: {},
            },
        ],
        'substance-drug': [
            {
                question: 'Substance',
                value: {
                    Coding: {
                        code: 'LA26702-3',
                        system: 'http://loinc.org',
                        display: 'Aspirin',
                    },
                },
                items: {},
            },
        ],
    },
};

const currentData2 = {
    type: [
        {
            question: 'Type',
            value: {
                Coding: {
                    code: '418634005',
                    system: 'http://hl7.org/fhir/allergy-intolerance-category',
                    display: 'Drug',
                },
            },
            items: {},
        },
    ],
    reaction: [
        {
            question: 'Reaction',
            value: {
                Coding: {
                    code: '422587007',
                    system: 'http://snomed.ct',
                    display: 'Nausea',
                },
            },
            items: {},
        },
    ],
    'substance-drug': [
        {
            question: 'Substance',
            value: {
                Coding: {
                    code: 'LA30118-6',
                    system: 'http://loinc.org',
                    display: 'Sulfa drugs',
                },
            },
            items: {},
        },
    ],
};
const prevData2 = {
    type: [
        {
            question: 'Type',
            value: {
                Coding: {
                    code: '418634005',
                    system: 'http://hl7.org/fhir/allergy-intolerance-category',
                    display: 'Drug',
                },
            },
            items: {},
        },
    ],
    reaction: [
        {
            question: 'Reaction',
            value: {
                Coding: {
                    code: '422587007',
                    system: 'http://snomed.ct',
                    display: 'Nausea',
                },
            },
            items: {},
        },
    ],
    'substance-drug': [
        {
            question: 'Substance',
            value: {
                Coding: {
                    code: 'LA30118-6',
                    system: 'http://loinc.org',
                    display: 'Sulfa drugs',
                },
            },
            items: {},
        },
    ],
    notes: [
        {
            question: 'Notes',
            value: {
                string: 'test note text',
            },
            items: {},
        },
    ],
};
const result2 = {
    diffBefore: {
        notes: [
            {
                question: 'Notes',
                value: {
                    string: 'test note text',
                },
                items: {},
            },
        ],
    },
    diffAfter: {},
};

const currentData3 = {
    type: [
        {
            question: 'Type',
            value: {
                Coding: {
                    code: '414285001',
                    system: 'http://hl7.org/fhir/allergy-intolerance-category',
                    display: 'Food',
                },
            },
            items: {},
        },
    ],
    reaction: [
        {
            question: 'Reaction',
            value: {
                Coding: {
                    code: '422587007',
                    system: 'http://snomed.ct',
                    display: 'Nausea',
                },
            },
            items: {},
        },
    ],
    'substance-food': [
        {
            question: 'Substance',
            value: {
                Coding: {
                    code: '102259006',
                    system: 'http://snomed.ct',
                    display: 'Citrus fruit',
                },
            },
            items: {},
        },
    ],
    notes: [
        {
            question: 'Notes',
            value: {},
            items: {},
        },
    ],
};
const prevData3 = {
    type: [
        {
            question: 'Type',
            value: {
                Coding: {
                    code: '418634005',
                    system: 'http://hl7.org/fhir/allergy-intolerance-category',
                    display: 'Drug',
                },
            },
            items: {},
        },
    ],
    reaction: [
        {
            question: 'Reaction',
            value: {
                Coding: {
                    code: '422587007',
                    system: 'http://snomed.ct',
                    display: 'Nausea',
                },
            },
            items: {},
        },
    ],
    'substance-drug': [
        {
            question: 'Substance',
            value: {
                Coding: {
                    code: 'LA30118-6',
                    system: 'http://loinc.org',
                    display: 'Sulfa drugs',
                },
            },
            items: {},
        },
    ],
};
const result3 = {
    diffBefore: {
        type: [
            {
                question: 'Type',
                value: {
                    Coding: {
                        code: '418634005',
                        system: 'http://hl7.org/fhir/allergy-intolerance-category',
                        display: 'Drug',
                    },
                },
                items: {},
            },
        ],
        'substance-drug': [
            {
                question: 'Substance',
                value: {
                    Coding: {
                        code: 'LA30118-6',
                        system: 'http://loinc.org',
                        display: 'Sulfa drugs',
                    },
                },
                items: {},
            },
        ],
    },
    diffAfter: {
        type: [
            {
                question: 'Type',
                value: {
                    Coding: {
                        code: '414285001',
                        system: 'http://hl7.org/fhir/allergy-intolerance-category',
                        display: 'Food',
                    },
                },
                items: {},
            },
        ],
        'substance-food': [
            {
                question: 'Substance',
                value: {
                    Coding: {
                        code: '102259006',
                        system: 'http://snomed.ct',
                        display: 'Citrus fruit',
                    },
                },
                items: {},
            },
        ],
    },
};
