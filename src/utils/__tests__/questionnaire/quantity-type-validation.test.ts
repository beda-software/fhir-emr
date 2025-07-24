import { FCEQuestionnaire, FormAnswerItems } from 'sdc-qrf';

import { questionnaireToValidationSchema } from 'src/utils';

type QuantityQuestionnaireData = {
    questionnaire: FCEQuestionnaire;
    answer: Record<string, FormAnswerItems[] | undefined>;
    success: boolean;
    description: string;
};

const QUANTITY_TEST_DATA: QuantityQuestionnaireData[] = [
    {
        description: 'Required quantity - complete FHIR data with all fields',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-complete',
            title: 'Complete Quantity Test',
            status: 'active',
            item: [
                {
                    linkId: 'weight',
                    type: 'quantity',
                    text: 'Body Weight',
                    required: true,
                    unitOption: [
                        {
                            system: 'http://unitsofmeasure.org',
                            code: '[lb_av]',
                            display: 'Pounds',
                        },
                    ],
                },
            ],
        },
        answer: {
            weight: [
                {
                    value: {
                        Quantity: {
                            value: 185,
                            unit: 'Pounds',
                            system: 'http://unitsofmeasure.org',
                            code: '[lb_av]',
                        },
                    },
                },
            ],
        },
        success: true,
    },
    {
        description: 'Required quantity - minimal valid data (only value)',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-minimal',
            title: 'Minimal Quantity Test',
            status: 'active',
            item: [
                {
                    linkId: 'temperature',
                    type: 'quantity',
                    text: 'Temperature Reading',
                    required: true,
                },
            ],
        },
        answer: {
            temperature: [
                {
                    value: {
                        Quantity: {
                            value: 37.5,
                        },
                    },
                },
            ],
        },
        success: true,
    },
    {
        description: 'Required quantity - value with unit display',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-with-unit',
            title: 'Quantity with Unit',
            status: 'active',
            item: [
                {
                    linkId: 'height',
                    type: 'quantity',
                    text: 'Height',
                    required: true,
                    unitOption: [
                        {
                            system: 'http://unitsofmeasure.org',
                            code: 'cm',
                            display: 'Centimeters',
                        },
                    ],
                },
            ],
        },
        answer: {
            height: [
                {
                    value: {
                        Quantity: {
                            value: 175.5,
                            unit: 'Centimeters',
                            code: 'cm',
                        },
                    },
                },
            ],
        },
        success: true,
    },
    {
        description: 'Required quantity - with valid comparator',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-comparator',
            title: 'Quantity with Comparator',
            status: 'active',
            item: [
                {
                    linkId: 'bloodPressure',
                    type: 'quantity',
                    text: 'Systolic Blood Pressure',
                    required: true,
                    unitOption: [
                        {
                            system: 'http://unitsofmeasure.org',
                            code: 'mm[Hg]',
                            display: 'mmHg',
                        },
                    ],
                },
            ],
        },
        answer: {
            bloodPressure: [
                {
                    value: {
                        Quantity: {
                            value: 120,
                            unit: 'mmHg',
                            system: 'http://unitsofmeasure.org',
                            code: 'mm[Hg]',
                            comparator: '>',
                        },
                    },
                },
            ],
        },
        success: true,
    },
    {
        description: 'Required quantity - decimal value with precise units',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-decimal',
            title: 'Decimal Quantity',
            status: 'active',
            item: [
                {
                    linkId: 'dosage',
                    type: 'quantity',
                    text: 'Medication Dosage',
                    required: true,
                    unitOption: [
                        {
                            system: 'http://unitsofmeasure.org',
                            code: 'mg',
                            display: 'Milligrams',
                        },
                    ],
                },
            ],
        },
        answer: {
            dosage: [
                {
                    value: {
                        Quantity: {
                            value: 2.5,
                            unit: 'Milligrams',
                            system: 'http://unitsofmeasure.org',
                            code: 'mg',
                        },
                    },
                },
            ],
        },
        success: true,
    },
    {
        description: 'Required quantity - missing data (undefined)',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-required-missing',
            title: 'Required Missing Quantity',
            status: 'active',
            item: [
                {
                    linkId: 'weight',
                    type: 'quantity',
                    text: 'Weight',
                    required: true,
                },
            ],
        },
        answer: {
            weight: undefined,
        },
        success: false,
    },
    {
        description: 'Required quantity - missing required value field',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-missing-value',
            title: 'Missing Value Field',
            status: 'active',
            item: [
                {
                    linkId: 'weight',
                    type: 'quantity',
                    text: 'Weight',
                    required: true,
                },
            ],
        },
        answer: {
            weight: [
                {
                    value: {
                        Quantity: {
                            unit: 'kg',
                            system: 'http://unitsofmeasure.org',
                            code: 'kg',
                        },
                    },
                },
            ],
        },
        success: false,
    },
    {
        description: 'Required quantity - invalid comparator value',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-invalid-comparator',
            title: 'Invalid Comparator',
            status: 'active',
            item: [
                {
                    linkId: 'temperature',
                    type: 'quantity',
                    text: 'Temperature',
                    required: true,
                },
            ],
        },
        answer: {
            temperature: [
                {
                    value: {
                        Quantity: {
                            value: 37.5,
                            unit: 'Celsius',
                            comparator: 'invalid_comparator' as any,
                        },
                    },
                },
            ],
        },
        success: false,
    },
    {
        description: 'Optional quantity - with complete valid data',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-optional-valid',
            title: 'Optional Valid Quantity',
            status: 'active',
            item: [
                {
                    linkId: 'weight',
                    type: 'quantity',
                    text: 'Weight',
                    required: false,
                    unitOption: [
                        {
                            system: 'http://unitsofmeasure.org',
                            code: 'kg',
                            display: 'Kilograms',
                        },
                    ],
                },
            ],
        },
        answer: {
            weight: [
                {
                    value: {
                        Quantity: {
                            value: 75.5,
                            unit: 'Kilograms',
                            system: 'http://unitsofmeasure.org',
                            code: 'kg',
                        },
                    },
                },
            ],
        },
        success: true,
    },
    {
        description: 'Optional quantity - no data provided (undefined)',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-optional-undefined',
            title: 'Optional Undefined Quantity',
            status: 'active',
            item: [
                {
                    linkId: 'weight',
                    type: 'quantity',
                    text: 'Weight',
                    required: false,
                },
            ],
        },
        answer: {
            weight: undefined,
        },
        success: true,
    },
    {
        description: 'Edge case - zero value should be valid',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-zero',
            title: 'Zero Value Quantity',
            status: 'active',
            item: [
                {
                    linkId: 'measurement',
                    type: 'quantity',
                    text: 'Measurement',
                    required: true,
                },
            ],
        },
        answer: {
            measurement: [
                {
                    value: {
                        Quantity: {
                            value: 0,
                            unit: 'units',
                        },
                    },
                },
            ],
        },
        success: true,
    },
    {
        description: 'Edge case - negative value should be valid',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'quantity-negative',
            title: 'Negative Value Quantity',
            status: 'active',
            item: [
                {
                    linkId: 'temperature',
                    type: 'quantity',
                    text: 'Temperature',
                    required: true,
                },
            ],
        },
        answer: {
            temperature: [
                {
                    value: {
                        Quantity: {
                            value: -10,
                            unit: 'Celsius',
                        },
                    },
                },
            ],
        },
        success: true,
    },
];

describe('Quantity type validation', () => {
    describe('Individual test cases', () => {
        test.each(QUANTITY_TEST_DATA)('$description', async (testData) => {
            const validationSchema = questionnaireToValidationSchema(testData.questionnaire);
            const isValid = await validationSchema.isValid(testData.answer);
            expect(isValid).toBe(testData.success);
        });
    });

    describe('Comparator validation', () => {
        test('should validate all FHIR-compliant comparator values', async () => {
            const validComparators = ['<', '<=', '>=', '>'];

            for (const comparator of validComparators) {
                const questionnaire: FCEQuestionnaire = {
                    resourceType: 'Questionnaire',
                    id: 'quantity-comparator-test',
                    title: 'Quantity Comparator Test',
                    status: 'active',
                    item: [
                        {
                            linkId: 'measurement',
                            type: 'quantity',
                            text: 'Measurement',
                            required: true,
                        },
                    ],
                };

                const answer = {
                    measurement: [
                        {
                            value: {
                                Quantity: {
                                    value: 100,
                                    unit: 'units',
                                    comparator,
                                },
                            },
                        },
                    ],
                };

                const validationSchema = questionnaireToValidationSchema(questionnaire);
                const isValid = await validationSchema.isValid(answer);
                expect(isValid).toBe(true);
            }
        });

        test('should reject invalid comparator values', async () => {
            const invalidComparators = ['!=', '~', 'approx', 'eq', 'ne'];

            for (const comparator of invalidComparators) {
                const questionnaire: FCEQuestionnaire = {
                    resourceType: 'Questionnaire',
                    id: 'quantity-invalid-comparator-test',
                    title: 'Invalid Quantity Comparator Test',
                    status: 'active',
                    item: [
                        {
                            linkId: 'measurement',
                            type: 'quantity',
                            text: 'Measurement',
                            required: true,
                        },
                    ],
                };

                const answer = {
                    measurement: [
                        {
                            value: {
                                Quantity: {
                                    value: 100,
                                    unit: 'units',
                                    comparator: comparator as any,
                                },
                            },
                        },
                    ],
                };

                const validationSchema = questionnaireToValidationSchema(questionnaire);
                const isValid = await validationSchema.isValid(answer);
                expect(isValid).toBe(false);
            }
        });
    });

    describe('System URL validation', () => {
        test('should accept valid URL formats for system field', async () => {
            const validUrls = [
                'http://unitsofmeasure.org',
                'https://example.com/units',
                'http://hl7.org/fhir/ValueSet/units-of-measure',
                'https://www.example.org/custom-units',
            ];

            for (const systemUrl of validUrls) {
                const questionnaire: FCEQuestionnaire = {
                    resourceType: 'Questionnaire',
                    id: 'quantity-valid-system-test',
                    title: 'Valid System URL Test',
                    status: 'active',
                    item: [
                        {
                            linkId: 'measurement',
                            type: 'quantity',
                            text: 'Measurement',
                            required: true,
                        },
                    ],
                };

                const answer = {
                    measurement: [
                        {
                            value: {
                                Quantity: {
                                    value: 100,
                                    unit: 'units',
                                    system: systemUrl,
                                    code: 'test-code',
                                },
                            },
                        },
                    ],
                };

                const validationSchema = questionnaireToValidationSchema(questionnaire);
                const isValid = await validationSchema.isValid(answer);
                expect(isValid).toBe(true);
            }
        });
    });

    describe('Value field validation', () => {
        test('should accept various numeric formats', async () => {
            const numericValues = [0, 1, -1, 0.5, -0.5, 123.456, 1000000, 0.000001];

            for (const value of numericValues) {
                const questionnaire: FCEQuestionnaire = {
                    resourceType: 'Questionnaire',
                    id: 'quantity-numeric-test',
                    title: 'Numeric Value Test',
                    status: 'active',
                    item: [
                        {
                            linkId: 'measurement',
                            type: 'quantity',
                            text: 'Measurement',
                            required: true,
                        },
                    ],
                };

                const answer = {
                    measurement: [
                        {
                            value: {
                                Quantity: {
                                    value,
                                    unit: 'units',
                                },
                            },
                        },
                    ],
                };

                const validationSchema = questionnaireToValidationSchema(questionnaire);
                const isValid = await validationSchema.isValid(answer);
                expect(isValid).toBe(true);
            }
        });
    });
});
