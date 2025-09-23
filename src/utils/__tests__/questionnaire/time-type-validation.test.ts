import { FCEQuestionnaire, FCEQuestionnaireItem, FormAnswerItems } from 'sdc-qrf';

import { questionnaireToValidationSchema } from 'src/utils';

type TimeQuestionnaireData = {
    questionnaire: FCEQuestionnaire;
    answer: Record<string, FormAnswerItems[] | undefined>;
    success: boolean;
    description: string;
};

interface PrepareQuestionnaireProps {
    description: string;
    item: Required<Pick<FCEQuestionnaireItem, 'type'>> & Partial<Omit<FCEQuestionnaireItem, 'type'>>;
    answer: Record<string, FormAnswerItems[] | undefined>;
    success: boolean;
}

const prepareQuestionnaire = (props: PrepareQuestionnaireProps): TimeQuestionnaireData => {
    const { description, item, answer, success } = props;
    return {
        description,
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'time-test',
            title: 'Time Test',
            status: 'active',
            item: [
                {
                    linkId: 'time',
                    ...item,
                },
            ],
        },
        answer,
        success,
    };
};

const TIME_TEST_DATA: PrepareQuestionnaireProps[] = [
    {
        description: 'Required time - missing value',
        item: {
            type: 'time',
            required: true,
        },
        answer: {},
        success: false,
    },
    {
        description: 'Valid time',
        item: {
            type: 'time',
        },
        answer: {
            time: [{ value: { time: '12:00:00' } }],
        },
        success: true,
    },
    {
        description: 'Invalid time - missing seconds',
        item: {
            type: 'time',
        },
        answer: {
            time: [{ value: { time: '12:00' } }],
        },
        success: false,
    },
    {
        description: 'Valid time - extra milliseconds',
        item: {
            type: 'time',
        },
        answer: {
            time: [{ value: { time: '12:00:00.000' } }],
        },
        success: true,
    },
    {
        description: 'Valid time - with timezone',
        item: {
            type: 'time',
        },
        answer: {
            time: [{ value: { time: '12:00:00.000Z' } }],
        },
        success: true,
    },
    {
        description: 'Valid time - with timezone - ISO 8601',
        item: {
            type: 'time',
        },
        answer: {
            time: [{ value: { time: '12:00:00.000+00:00' } }],
        },
        success: true,
    },
    {
        description: 'Invalid time - 24 hours',
        item: {
            type: 'time',
        },
        answer: {
            time: [{ value: { time: '24:00:00' } }],
        },
        success: false,
    },
    {
        description: 'Invalid time - 60 minutes',
        item: {
            type: 'time',
        },
        answer: {
            time: [{ value: { time: '00:60:00' } }],
        },
        success: false,
    },
    {
        description: 'Invalid time - 61 seconds',
        item: {
            type: 'time',
        },
        answer: {
            time: [{ value: { time: '00:00:61' } }],
        },
        success: false,
    },
];

const DATE_TEST_DATA: PrepareQuestionnaireProps[] = [
    {
        description: 'Required date - missing value',
        item: {
            type: 'date',
            required: true,
        },
        answer: {},
        success: false,
    },
    {
        description: 'Valid date with year',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: '2025' } }],
        },
        success: true,
    },
    {
        description: 'Valid date with year and month',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: '2025-01' } }],
        },
        success: true,
    },
    {
        description: 'Valid date with year, month and day',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: '2025-01-01' } }],
        },
        success: true,
    },
    {
        description: 'Valid date with year, month and day - ISO 8601',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: '2025-01-01T00:00:00.000Z' } }],
        },
        success: true,
    },
    {
        description: 'Valid date with year, month and day - ISO 8601 with timezone',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: '2025-01-01T00:00:00.000+00:00' } }],
        },
        success: true,
    },
    {
        description: 'Valid date with year, month and day - ISO 8601 - missing seconds',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: '2025-01-01T00:00' } }],
        },
        success: true,
    },
    {
        description: 'Invalid date with year, month, day, hour',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: '2025-01-01T00' } }],
        },
        success: false,
    },
    {
        description: 'Invalid date - time only',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: '00:00:00' } }],
        },
        success: false,
    },
    {
        description: 'Invalid date - time only',
        item: {
            type: 'date',
        },
        answer: {
            time: [{ value: { date: 'T00:00:00Z' } }],
        },
        success: false,
    },
];

const DATE_TIME_TEST_DATA: PrepareQuestionnaireProps[] = [
    {
        description: 'Required dateTime - missing value',
        item: {
            type: 'dateTime',
            required: true,
        },
        answer: {},
        success: false,
    },
    {
        description: 'Valid dateTime with year',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: '2025' } }],
        },
        success: true,
    },
    {
        description: 'Valid dateTime with year and month',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: '2025-01' } }],
        },
        success: true,
    },
    {
        description: 'Valid dateTime with year, month and day',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: '2025-01-01' } }],
        },
        success: true,
    },
    {
        description: 'Valid dateTime with year, month and day - ISO 8601',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: '2025-01-01T00:00:00.000Z' } }],
        },
        success: true,
    },
    {
        description: 'Valid dateTime with year, month and day - ISO 8601 with timezone',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: '2025-01-01T00:00:00.000+00:00' } }],
        },
        success: true,
    },
    {
        description: 'Valid dateTime with year, month and day - ISO 8601 - missing seconds',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: '2025-01-01T00:00' } }],
        },
        success: true,
    },
    {
        description: 'Invalid dateTime with year, month, day, hour',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: '2025-01-01T00' } }],
        },
        success: false,
    },
    {
        description: 'Invalid dateTime - time only',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: 'T00:00:00' } }],
        },
        success: false,
    },
    {
        description: 'Invalid dateTime - time only',
        item: {
            type: 'dateTime',
        },
        answer: {
            time: [{ value: { dateTime: '00:00:00' } }],
        },
        success: false,
    },
];

describe('Time type validation', () => {
    test.each(TIME_TEST_DATA)(`$description`, async (timeQuestionnaireData) => {
        const { questionnaire, answer, success } = prepareQuestionnaire(timeQuestionnaireData);
        const validationSchema = questionnaireToValidationSchema(questionnaire);
        const isValid = await validationSchema.isValid(answer);
        expect(isValid).toBe(success);
    });
});

describe('Date type validation', () => {
    test.each(DATE_TEST_DATA)(`$description`, async (dateQuestionnaireData) => {
        const { questionnaire, answer, success } = prepareQuestionnaire(dateQuestionnaireData);
        const validationSchema = questionnaireToValidationSchema(questionnaire);
        const isValid = await validationSchema.isValid(answer);
        expect(isValid).toBe(success);
    });
});

describe('DateTime type validation', () => {
    test.each(DATE_TIME_TEST_DATA)(`$description`, async (dateTimeQuestionnaireData) => {
        const { questionnaire, answer, success } = prepareQuestionnaire(dateTimeQuestionnaireData);
        const validationSchema = questionnaireToValidationSchema(questionnaire);
        const isValid = await validationSchema.isValid(answer);
        expect(isValid).toBe(success);
    });
});
