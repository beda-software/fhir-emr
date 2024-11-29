import { isItemEnabled } from 'src/utils/enableWhen';

import { generateQAndQRData, QuestionnaireData } from './utils';

const ENABLE_WHEN_EQUAL_QUESTIONAIRES: QuestionnaireData[] = [
    {
        ...generateQAndQRData({
            type: 'integer',
            operator: '=',
            conditionValue: { integer: 1 },
            answerValue: { integer: 1 },
        }),
        enabled: true,
    },
    {
        ...generateQAndQRData({
            type: 'integer',
            operator: '=',
            conditionValue: { integer: 1 },
            answerValue: { integer: 2 },
        }),
        enabled: false,
    },
    {
        ...generateQAndQRData({
            type: 'string',
            operator: '=',
            conditionValue: { string: 'test' },
            answerValue: { string: 'test' },
        }),
        enabled: true,
    },
    {
        ...generateQAndQRData({
            type: 'string',
            operator: '=',
            conditionValue: { string: 'test' },
            answerValue: { string: 'test1' },
        }),
        enabled: false,
    },
    {
        ...generateQAndQRData({
            type: 'choice',
            operator: '=',
            conditionValue: {
                Coding: {
                    system: 'http://loinc.org',
                    code: '12345',
                    display: 'Test',
                },
            },
            answerValue: {
                Coding: {
                    system: 'http://loinc.org',
                    code: '12345',
                    display: 'Test',
                },
            },
        }),
        enabled: true,
    },
    {
        ...generateQAndQRData({
            type: 'choice',
            operator: '=',
            conditionValue: {
                Coding: {
                    system: 'http://loinc.org',
                    code: '12345',
                    display: 'Test',
                },
            },
            answerValue: {
                Coding: {
                    system: 'http://loinc123123.org',
                    code: '12345',
                    display: 'Test',
                },
            },
        }),
        enabled: false,
    },
    {
        ...generateQAndQRData({
            type: 'boolean',
            operator: '=',
            conditionValue: { boolean: true },
            answerValue: { boolean: true },
        }),
        enabled: true,
    },
    {
        ...generateQAndQRData({
            type: 'boolean',
            operator: '=',
            conditionValue: { boolean: true },
            answerValue: { boolean: false },
        }),
        enabled: false,
    },
];

describe('Enable when: "="', () => {
    test.each(ENABLE_WHEN_EQUAL_QUESTIONAIRES)(
        'should check if enabledLinkId is enabled or not',
        async (questionnaireData) => {
            const answerOptionArray = questionnaireData!.questionnaireResponse!.item![0]?.answer;
            const conditionValue = questionnaireData!.questionnaire!.item![1]?.enableWhen![0]?.answer;

            const enabledResult = isItemEnabled({
                answerOptionArray,
                answer: conditionValue,
                operator: '=',
            });

            expect(enabledResult).toBe(questionnaireData.enabled);
        },
    );
});
