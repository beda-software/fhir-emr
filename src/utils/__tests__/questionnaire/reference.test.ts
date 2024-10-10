import { Questionnaire } from '@beda.software/aidbox-types';

import { questionnaireToValidationSchema } from 'src/utils';

type QuestionnaireData = {
    questionnaire: Questionnaire;
    answer: any;
    success: boolean;
};

const REFERENCE_QUESTIONAIRES: QuestionnaireData[] = [
    {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'reference-required',
            title: 'Reference required',
            status: 'active',
            item: [
                {
                    linkId: 'reference-required-filed',
                    type: 'reference',
                    text: 'Reference required',
                    required: true,
                },
            ],
        },
        answer: {
            'reference-required-filed': [
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
            id: 'reference-optional',
            title: 'Reference optional',
            status: 'active',
            item: [
                {
                    linkId: 'reference-optional-filed',
                    type: 'reference',
                    text: 'Reference optional',
                    required: false,
                },
            ],
        },
        answer: {
            'reference-optional-filed': [undefined],
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
                    linkId: 'reference-required-filed',
                    type: 'reference',
                    text: 'Reference required',
                    required: true,
                },
            ],
        },
        answer: {
            'reference-required-filed': [undefined],
        },
        success: false,
    },
];

describe('Reference', () => {
    test.each(REFERENCE_QUESTIONAIRES)('should return the correct reference', async (questionnaireData) => {
        const validationSchema = questionnaireToValidationSchema(questionnaireData.questionnaire);
        const isValid = await validationSchema.isValid(questionnaireData.answer);
        expect(isValid).toBe(questionnaireData.success);
    });
});
