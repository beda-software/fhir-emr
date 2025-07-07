import { t } from '@lingui/macro';
import { FCEQuestionnaire, FormAnswerItems } from 'sdc-qrf';

import { CustomYupTestsMap, questionnaireToValidationSchema } from 'src/utils';

type QuestionnaireData = {
    questionnaire: FCEQuestionnaire;
    answer: Record<string, FormAnswerItems[] | undefined>;
    success: boolean;
};

const customYupTestsMap: CustomYupTestsMap = {
    hasLower: [
        {
            name: 'lower-character-set',
            message: () => t`Has at least one lower case letter`,
            test: (value) => {
                if (!value) return false;
                const hasLowercase = /[a-z]/.test(value);
                return hasLowercase;
            },
        },
    ],
    hasLowerUpper: [
        {
            name: 'lower-character-set',
            message: () => t`Has at least one lower case letter`,
            test: (value) => {
                if (!value) return false;
                const hasLowercase = /[a-z]/.test(value);
                return hasLowercase;
            },
        },
        {
            name: 'upper-character-set',
            message: () => t`Has at least one uppercase letter`,
            test: (value) => {
                if (!value) return false;
                const hasUppercase = /[A-Z]/.test(value);
                return hasUppercase;
            },
        },
    ],
    hasLowerUpperNumber: [
        {
            name: 'lower-character-set',
            message: () => t`Has at least one lower case letter`,
            test: (value) => {
                if (!value) return false;
                const hasLowercase = /[a-z]/.test(value);
                return hasLowercase;
            },
        },
        {
            name: 'upper-character-set',
            message: () => t`Has at least one uppercase letter`,
            test: (value) => {
                if (!value) return false;
                const hasUppercase = /[A-Z]/.test(value);
                return hasUppercase;
            },
        },
        {
            name: 'number-character-set',
            message: () => t`Has at least one number`,
            test: (value) => {
                if (!value) return false;
                const hasNumber = /[0-9]/.test(value);
                return hasNumber;
            },
        },
    ],
};

const QUESTIONNAIRES_TEST_DATA: QuestionnaireData[] = [
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'custom-control',
            title: 'Item with custom item control',
            status: 'active',
            item: [
                {
                    linkId: 'custom',
                    type: 'string',
                    text: 'Has lower',
                    itemControl: {
                        coding: [{ code: 'hasLower' }],
                    },
                },
            ],
        },
        answer: {
            custom: [
                {
                    value: {
                        string: 'lower',
                    },
                },
            ],
        },
        success: true,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'custom-control',
            title: 'Item with custom item control',
            status: 'active',
            item: [
                {
                    linkId: 'custom',
                    type: 'string',
                    text: 'Has lower',
                    itemControl: {
                        coding: [{ code: 'hasLower' }],
                    },
                },
            ],
        },
        answer: {
            custom: [
                {
                    value: {
                        string: 'UPPER',
                    },
                },
            ],
        },
        success: false,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'custom-control',
            title: 'Item with custom item control',
            status: 'active',
            item: [
                {
                    linkId: 'custom',
                    type: 'string',
                    text: 'Has both lower and upper',
                    itemControl: {
                        coding: [{ code: 'hasLowerUpper' }],
                    },
                },
            ],
        },
        answer: {
            custom: [
                {
                    value: {
                        string: 'lower',
                    },
                },
            ],
        },
        success: false,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'custom-control',
            title: 'Item with custom item control',
            status: 'active',
            item: [
                {
                    linkId: 'custom',
                    type: 'string',
                    text: 'Has both lower and upper',
                    itemControl: {
                        coding: [{ code: 'hasLowerUpper' }],
                    },
                },
            ],
        },
        answer: {
            custom: [
                {
                    value: {
                        string: 'UPPER',
                    },
                },
            ],
        },
        success: false,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'custom-control',
            title: 'Item with custom item control',
            status: 'active',
            item: [
                {
                    linkId: 'custom',
                    type: 'string',
                    text: 'Has both lower and upper',
                    itemControl: {
                        coding: [{ code: 'hasLowerUpper' }],
                    },
                },
            ],
        },
        answer: {
            custom: [
                {
                    value: {
                        string: 'lowerUPPER',
                    },
                },
            ],
        },
        success: true,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'custom-control',
            title: 'Item with custom item control',
            status: 'active',
            item: [
                {
                    linkId: 'custom',
                    type: 'string',
                    text: 'Has lower',
                    itemControl: {
                        coding: [{ code: 'hasLowerUpperNumber' }],
                    },
                },
            ],
        },
        answer: {
            custom: [
                {
                    value: {
                        string: 'lower',
                    },
                },
            ],
        },
        success: false,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'custom-control',
            title: 'Item with custom item control',
            status: 'active',
            item: [
                {
                    linkId: 'custom',
                    type: 'string',
                    text: 'Has lower',
                    itemControl: {
                        coding: [{ code: 'hasLowerUpperNumber' }],
                    },
                },
            ],
        },
        answer: {
            custom: [
                {
                    value: {
                        string: 'lowerUPPER',
                    },
                },
            ],
        },
        success: false,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'custom-control',
            title: 'Item with custom item control',
            status: 'active',
            item: [
                {
                    linkId: 'custom',
                    type: 'string',
                    text: 'Has lower',
                    itemControl: {
                        coding: [{ code: 'hasLowerUpperNumber' }],
                    },
                },
            ],
        },
        answer: {
            custom: [
                {
                    value: {
                        string: 'lowerUPPER123',
                    },
                },
            ],
        },
        success: true,
    },
];

describe('Complex type validation', () => {
    test.each(QUESTIONNAIRES_TEST_DATA)('should return the correct result', async (questionnaireData) => {
        const validationSchema = questionnaireToValidationSchema(questionnaireData.questionnaire, customYupTestsMap);
        const isValid = await validationSchema.isValid(questionnaireData.answer);
        expect(isValid).toBe(questionnaireData.success);
    });
});
