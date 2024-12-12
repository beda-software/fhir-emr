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
                    answer: { integer: 10 },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { integer: 10 } }],
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
                    answer: { integer: 10 },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { integer: 9 } }],
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
                    answer: { integer: 10 },
                },
                {
                    question: 'q2',
                    operator: '>=',
                    answer: { integer: 5 },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { integer: 10 } }],
                },
                {
                    linkId: 'q2',
                    answer: [{ value: { integer: 5 } }],
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
                    answer: { integer: 10 },
                },
                {
                    question: 'q2',
                    operator: '>=',
                    answer: { integer: 5 },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { integer: 9 } }],
                },
                {
                    linkId: 'q2',
                    answer: [{ value: { integer: 5 } }],
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
                    answer: { integer: 10 },
                },
                {
                    question: 'q2',
                    operator: '>=',
                    answer: { integer: 5 },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { integer: 1 } }],
                },
                {
                    linkId: 'q2',
                    answer: [{ value: { integer: 5 } }],
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
