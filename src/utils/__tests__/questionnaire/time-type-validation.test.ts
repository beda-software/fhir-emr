import { FCEQuestionnaire, FormAnswerItems } from 'sdc-qrf';

import { questionnaireToValidationSchema } from 'src/utils';

type TimeQuestionnaireData = {
    questionnaire: FCEQuestionnaire;
    answer: Record<string, FormAnswerItems[] | undefined>;
    success: boolean;
    description: string;
};

const TIME_TEST_DATA: TimeQuestionnaireData[] = [
    {
        description: 'Required time - missing value',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-required',
            title: 'Required Time Test',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                    required: true,
                },
            ],
        },
        answer: {},
        success: false,
    },
    {
        description: 'Valid time',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-valid',
            title: 'Valid Time Test',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                },
            ],
        },
        answer: {
            time: [{ value: { time: '12:00:00' } }],
        },
        success: true,
    },
    {
        description: 'Invalid time - missing seconds',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-invalid',
            title: 'Invalid Time Test',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                },
            ],
        },
        answer: {
            time: [{ value: { time: '12:00' } }],
        },
        success: false,
    },
    {
        description: 'Valid time - extra milliseconds',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-valid-milliseconds',
            title: 'Valid Time Test with milliseconds',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                },
            ],
        },
        answer: {
            time: [{ value: { time: '12:00:00.000' } }],
        },
        success: true,
    },
    {
        description: 'Valid time - with timezone',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-valid-timezone',
            title: 'Valid Time Test with timezone',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                },
            ],
        },
        answer: {
            time: [{ value: { time: '12:00:00.000Z' } }],
        },
        success: true,
    },
    {
        description: 'Valid time - with timezone - ISO 8601',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-valid-timezone-iso-8601',
            title: 'Valid Time Test with timezone - ISO 8601',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                },
            ],
        },
        answer: {
            time: [{ value: { time: '12:00:00.000+00:00' } }],
        },
        success: true,
    },
    {
        description: 'Invalid time - 24 hours',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-invalid-24-hours',
            title: 'Invalid Time Test with 24 hours',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                },
            ],
        },
        answer: {
            time: [{ value: { time: '24:00:00' } }],
        },
        success: false,
    },
    {
        description: 'Invalid time - 60 minutes',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-invalid-60-minutes',
            title: 'Invalid Time Test with 60 minutes',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                },
            ],
        },
        answer: {
            time: [{ value: { time: '00:60:00' } }],
        },
        success: false,
    },
    {
        description: 'Invalid time - 61 seconds',
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-invalid-61-seconds',
            title: 'Invalid Time Test with 61 seconds',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    type: 'time',
                    text: 'Time',
                },
            ],
        },
        answer: {
            time: [{ value: { time: '00:00:61' } }],
        },
        success: false,
    },
];

describe('Time type validation', () => {
    test.each(TIME_TEST_DATA)('$description', async (timeQuestionnaireData) => {
        const validationSchema = questionnaireToValidationSchema(timeQuestionnaireData.questionnaire);
        const isValid = await validationSchema.isValid(timeQuestionnaireData.answer);
        expect(isValid).toBe(timeQuestionnaireData.success);
    });
});
