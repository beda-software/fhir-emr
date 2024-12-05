import { Questionnaire, QuestionnaireResponseItemAnswer } from '@beda.software/aidbox-types';

import { questionnaireToValidationSchema } from 'src/utils';

type QuestionnaireData = {
    questionnaire: Questionnaire;
    answer: Record<string, QuestionnaireResponseItemAnswer[] | undefined>;
    success: boolean;
};

const QUESTIONNAIRES_TEST_DATA: QuestionnaireData[] = [
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'reference-required',
            title: 'Reference required',
            status: 'active',
            item: [
                {
                    linkId: 'reference-required-filled',
                    type: 'reference',
                    text: 'Reference required',
                    repeats: true,
                    required: true,
                },
            ],
        },
        answer: {
            'reference-required-filled': [
                {
                    value: {
                        Reference: {
                            resourceType: 'Patient',
                            id: '1',
                            display: 'Patient 1',
                        },
                    },
                },
            ],
        },
        success: true,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'reference-required',
            title: 'Reference required',
            status: 'active',
            item: [
                {
                    linkId: 'reference-required-filled',
                    type: 'reference',
                    text: 'Reference required',
                    repeats: false,
                    required: true,
                },
            ],
        },
        answer: {
            'reference-required-filled': undefined,
        },
        success: false,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'reference-required',
            title: 'Reference required',
            status: 'active',
            item: [
                {
                    linkId: 'reference-required-filled',
                    type: 'reference',
                    text: 'Reference required',
                    repeats: true,
                    required: true,
                },
            ],
        },
        answer: {
            'reference-required-filled': [],
        },
        success: false,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'reference-optional',
            title: 'Reference optional',
            status: 'active',
            item: [
                {
                    linkId: 'reference-optional-filled',
                    type: 'reference',
                    text: 'Reference optional',
                    repeats: true,
                    required: false,
                },
            ],
        },
        answer: {
            'reference-optional-filled': [],
        },
        success: true,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'reference-required',
            title: 'Reference required',
            status: 'active',
            item: [
                {
                    linkId: 'reference-required-filled',
                    type: 'reference',
                    text: 'Reference required',
                    repeats: false,
                    required: false,
                },
            ],
        },
        answer: {
            'reference-required-filled': undefined,
        },
        success: true,
    },
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'reference-required',
            title: 'Reference required',
            status: 'active',
            item: [
                {
                    linkId: 'reference-required-filled',
                    type: 'reference',
                    text: 'Reference required',
                    repeats: false,
                    required: false,
                },
            ],
        },
        answer: {
            'reference-required-filled': [
                {
                    value: {
                        Reference: {
                            resourceType: 'Patient',
                            id: '1',
                            display: 'Patient 1',
                        },
                    },
                },
            ],
        },
        success: true,
    },
];

describe('Complex type validation', () => {
    test.each(QUESTIONNAIRES_TEST_DATA)('should return the correct result', async (questionnaireData) => {
        const validationSchema = questionnaireToValidationSchema(questionnaireData.questionnaire);
        const isValid = await validationSchema.isValid(questionnaireData.answer);
        expect(isValid).toBe(questionnaireData.success);
    });
});
