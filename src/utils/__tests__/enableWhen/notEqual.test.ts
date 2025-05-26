import {
    CONTROL_ITEM_LINK_ID,
    generateQAndQRData,
    QuestionnaireData,
    testEnableWhenCases,
    ENABLE_WHEN_TESTS_TITLE,
} from './utils';

const ENABLE_WHEN_NOT_EQUAL_QUESTIONAIRES: QuestionnaireData[] = [
    {
        ...generateQAndQRData({
            type: 'integer',
            enableWhen: [
                {
                    question: 'q1',
                    operator: '!=',
                    answerInteger: 1,
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueInteger: 1 }],
                },
                {
                    linkId: 'q2',
                    answer: [],
                },
            ],
        }),
    },
    {
        ...generateQAndQRData({
            type: 'integer',
            enableWhen: [
                {
                    question: 'q1',
                    operator: '!=',
                    answerString: 'test',
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueString: 'test2' }],
                },
                {
                    linkId: 'q2',
                    answer: [],
                },
                {
                    linkId: CONTROL_ITEM_LINK_ID,
                    answer: [],
                },
            ],
        }),
    },
    {
        ...generateQAndQRData({
            type: 'integer',
            enableWhen: [
                {
                    question: 'q1',
                    operator: '!=',
                    answerString: 'test1',
                },
                {
                    question: 'q2',
                    operator: '!=',
                    answerString: 'test2',
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueString: 'test1' }],
                },
                {
                    linkId: 'q2',
                    answer: [{ valueString: 'test2' }],
                },
            ],
        }),
    },
    {
        ...generateQAndQRData({
            type: 'integer',
            enableWhen: [
                {
                    question: 'q1',
                    operator: '!=',
                    answerString: 'test1',
                },
                {
                    question: 'q2',
                    operator: '!=',
                    answerString: 'test2',
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueString: 'asd' }],
                },
                {
                    linkId: 'q2',
                    answer: [{ valueString: 'test2' }],
                },
                {
                    linkId: CONTROL_ITEM_LINK_ID,
                    answer: [],
                },
            ],
        }),
    },
    {
        ...generateQAndQRData({
            type: 'integer',
            enableBehavior: 'any',
            enableWhen: [
                {
                    question: 'q1',
                    operator: '!=',
                    answerCoding: { code: 'test1', display: 'test1' },
                },
                {
                    question: 'q2',
                    operator: '!=',
                    answerCoding: { code: 'test2', display: 'test2' },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueCoding: { code: 'asd', display: 'asd' } }],
                },
                {
                    linkId: 'q2',
                    answer: [{ valueCoding: { code: 'test2', display: 'test2' } }],
                },
                {
                    linkId: CONTROL_ITEM_LINK_ID,
                    answer: [],
                },
            ],
        }),
    },
];

describe('Enable when: "!="', () => {
    test.each(ENABLE_WHEN_NOT_EQUAL_QUESTIONAIRES)(ENABLE_WHEN_TESTS_TITLE, testEnableWhenCases);
});
