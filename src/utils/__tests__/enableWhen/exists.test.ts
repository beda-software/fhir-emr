import {
    CONTROL_ITEM_LINK_ID,
    generateQAndQRData,
    QuestionnaireData,
    testEnableWhenCases,
    ENABLE_WHEN_TESTS_TITLE,
} from './utils';

const ENABLE_WHEN_EXISTS_QUESTIONAIRES: QuestionnaireData[] = [
    {
        ...generateQAndQRData({
            type: 'integer',
            enableWhen: [
                {
                    question: 'q1',
                    operator: 'exists',
                    answer: { boolean: true },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { string: 'test1' } }],
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
                    operator: 'exists',
                    answer: { boolean: false },
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
                    operator: 'exists',
                    answer: { boolean: true },
                },
                {
                    question: 'q2',
                    operator: 'exists',
                    answer: { boolean: true },
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
                    operator: 'exists',
                    answer: { boolean: true },
                },
                {
                    question: 'q2',
                    operator: 'exists',
                    answer: { boolean: true },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [],
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
                    operator: 'exists',
                    answer: { boolean: true },
                },
                {
                    question: 'q2',
                    operator: 'exists',
                    answer: { boolean: false },
                },
            ],
            qrItem: [
                {
                    linkId: 'q1',
                    answer: [{ value: { Coding: { code: 'asd', display: 'asd' } } }],
                },
                {
                    linkId: 'q2',
                    answer: [{ value: { Coding: { code: 'test2', display: 'test2' } } }],
                },
                {
                    linkId: CONTROL_ITEM_LINK_ID,
                    answer: [],
                },
            ],
        }),
    },
];

describe('Enable when: "exists"', () => {
    test.each(ENABLE_WHEN_EXISTS_QUESTIONAIRES)(ENABLE_WHEN_TESTS_TITLE, testEnableWhenCases);
});
