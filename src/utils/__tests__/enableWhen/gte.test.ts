import {
    CONTROL_ITEM_LINK_ID,
    generateQAndQRData,
    QuestionnaireData,
    testEnableWhenCases,
    ENABLE_WHEN_TESTS_TITLE,
} from './utils';

const ENABLE_WHEN_GTE_QUESTIONAIRES: QuestionnaireData[] = [
    {
        ...generateQAndQRData({
            type: 'integer',
            enableWhen: [
                {
                    question: 'q1',
                    operator: '>=',
                    answerInteger: 10,
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueInteger: 10 }],
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
                    operator: '>=',
                    answerInteger: 10,
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueInteger: 9 }],
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
                    operator: '>=',
                    answerInteger: 10,
                },
                {
                    question: 'q2',
                    operator: '>=',
                    answerInteger: 5,
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueInteger: 10 }],
                },
                {
                    linkId: 'q2',
                    answer: [{ valueInteger: 5 }],
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
                    operator: '>=',
                    answerInteger: 10,
                },
                {
                    question: 'q2',
                    operator: '>=',
                    answerInteger: 5,
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueInteger: 9 }],
                },
                {
                    linkId: 'q2',
                    answer: [{ valueInteger: 5 }],
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
                    operator: '>=',
                    answerInteger: 10,
                },
                {
                    question: 'q2',
                    operator: '>=',
                    answerInteger: 5,
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ valueInteger: 1 }],
                },
                {
                    linkId: 'q2',
                    answer: [{ valueInteger: 5 }],
                },
                {
                    linkId: CONTROL_ITEM_LINK_ID,
                    answer: [],
                },
            ],
        }),
    },
];

describe('Enable when: ">="', () => {
    test.each(ENABLE_WHEN_GTE_QUESTIONAIRES)(ENABLE_WHEN_TESTS_TITLE, testEnableWhenCases);
});
