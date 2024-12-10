import {
    CONTROL_ITEM_LINK_ID,
    generateQAndQRData,
    QuestionnaireData,
    testEnableWhenCases,
    ENABLE_WHEN_TESTS_TITLE,
} from './utils';

const ENABLE_WHEN_EQUAL_QUESTIONAIRES: QuestionnaireData[] = [
    {
        ...generateQAndQRData({
            type: 'integer',
            enableWhen: [
                {
                    question: 'q1',
                    operator: '=',
                    answer: { integer: 1 },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { integer: 1 } }],
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
                    operator: '=',
                    answer: { string: 'test' },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { string: 'test2' } }],
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
                    operator: '=',
                    answer: { string: 'test1' },
                },
                {
                    question: 'q2',
                    operator: '=',
                    answer: { string: 'test2' },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { string: 'test1' } }],
                },
                {
                    linkId: 'q2',
                    answer: [{ value: { string: 'test2' } }],
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
                    operator: '=',
                    answer: { string: 'test1' },
                },
                {
                    question: 'q2',
                    operator: '=',
                    answer: { string: 'test2' },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { string: 'asd' } }],
                },
                {
                    linkId: 'q2',
                    answer: [{ value: { string: 'test2' } }],
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
                    operator: '=',
                    answer: { Coding: { code: 'test1', display: 'test1' } },
                },
                {
                    question: 'q2',
                    operator: '=',
                    answer: { Coding: { code: 'test2', display: 'test2' } },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { Coding: { code: 'asd', display: 'asd' } } }],
                },
                {
                    linkId: 'q2',
                    answer: [{ value: { Coding: { code: 'test2', display: 'Different display' } } }],
                },
                {
                    linkId: CONTROL_ITEM_LINK_ID,
                    answer: [],
                },
            ],
        }),
    },
];

describe('Enable when: "="', () => {
    test.each(ENABLE_WHEN_EQUAL_QUESTIONAIRES)(ENABLE_WHEN_TESTS_TITLE, testEnableWhenCases);
});
