import { Questionnaire } from '@beda.software/aidbox-types';

import { questionnaireToValidationSchema } from 'src/utils';

type QuestionnaireData = {
    questionnaire: Questionnaire;
    answer: any;
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
    },
];

describe('Reference', () => {
    test.each(REFERENCE_QUESTIONAIRES)('should return the correct reference', async (questionnaireData) => {
        const scheme = questionnaireToValidationSchema(questionnaireData.questionnaire);

        const result = await scheme.validate(questionnaireData.answer);
        expect(result).toEqual(questionnaireData.answer);
    });
});
