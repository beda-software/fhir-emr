import { Questionnaire } from 'fhir/r4b';

import { moveQuestionnaireItem } from '../utils';

describe('moveQuestionnaireItem test', () => {
    test('move item on a top Questionnaire item level', () => {
        const result = moveQuestionnaireItem(
            q1,
            {
                questionItem: {
                    text: 'Notes3',
                    type: 'string',
                    linkId: 'notes3',
                },
                parentPath: [],
            },
            {
                questionItem: {
                    text: 'Notes2',
                    type: 'string',
                    linkId: 'notes2',
                },
                parentPath: [],
            },
        );

        expect(result).toEqual(q1Result);
    });

    test('move item from Group to top Questionnaire item level', () => {
        const result = moveQuestionnaireItem(
            q3,
            {
                questionItem: {
                    text: 'Notes3',
                    type: 'string',
                    linkId: 'notes3',
                },
                parentPath: ['group-1', 'items'],
            },
            {
                questionItem: {
                    text: 'Notes2',
                    type: 'string',
                    linkId: 'notes2',
                },
                parentPath: [],
            },
        );

        expect(result).toEqual(q3Result);
    });

    test('move item from top Questionnaire item level to Group', () => {
        const result = moveQuestionnaireItem(
            q2,
            {
                questionItem: {
                    text: 'Notes1',
                    type: 'string',
                    linkId: 'notes1',
                },
                parentPath: [],
            },
            {
                questionItem: {
                    text: 'Notes3',
                    type: 'string',
                    linkId: 'notes3',
                },
                parentPath: ['group-1', 'items'],
            },
        );

        expect(result).toEqual(q2Result);
    });

    test('move item on a top Questionnaire item level before target', () => {
        const result = moveQuestionnaireItem(
            q4,
            {
                questionItem: {
                    text: 'Notes2',
                    type: 'string',
                    linkId: 'notes2',
                },
                parentPath: [],
            },
            {
                questionItem: {
                    text: 'Notes3',
                    type: 'string',
                    linkId: 'notes3',
                },
                parentPath: [],
            },
            'before',
        );

        expect(result).toEqual(q4Result);
    });
});

const q1: Questionnaire = {
    item: [
        {
            text: 'Notes1',
            type: 'string',
            linkId: 'notes1',
        },
        {
            text: 'Notes2',
            type: 'string',
            linkId: 'notes2',
        },
        {
            text: 'Notes3',
            type: 'string',
            linkId: 'notes3',
        },
    ],
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    resourceType: 'Questionnaire',
    title: 'Test',
    status: 'active',
    id: 'test',
    url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/test',
};

const q1Result: Questionnaire = {
    item: [
        {
            text: 'Notes1',
            type: 'string',
            linkId: 'notes1',
        },
        {
            text: 'Notes3',
            type: 'string',
            linkId: 'notes3',
        },
        {
            text: 'Notes2',
            type: 'string',
            linkId: 'notes2',
        },
    ],
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    resourceType: 'Questionnaire',
    title: 'Test',
    status: 'active',
    id: 'test',
    url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/test',
};

const q2: Questionnaire = {
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    item: [
        {
            text: 'Notes1',
            type: 'string',
            linkId: 'notes1',
        },
        {
            item: [
                {
                    text: 'Notes2',
                    type: 'string',
                    linkId: 'notes2',
                },
                {
                    text: 'Notes3',
                    type: 'string',
                    linkId: 'notes3',
                },
            ],
            text: 'Over the last two weeks, how often have you been bothered by the following problems?',
            type: 'group',
            linkId: 'group-1',
        },
    ],
    resourceType: 'Questionnaire',
    title: 'Test',
    status: 'active',
    id: 'test',
    url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/test',
};

const q2Result: Questionnaire = {
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    item: [
        {
            text: 'Notes1',
            type: 'string',
            linkId: 'notes1',
        },
        {
            text: 'Notes3',
            type: 'string',
            linkId: 'notes3',
        },
        {
            item: [
                {
                    text: 'Notes2',
                    type: 'string',
                    linkId: 'notes2',
                },
            ],
            text: 'Over the last two weeks, how often have you been bothered by the following problems?',
            type: 'group',
            linkId: 'group-1',
        },
    ],
    resourceType: 'Questionnaire',
    title: 'Test',
    status: 'active',
    id: 'test',
    url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/test',
};

const q3: Questionnaire = {
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    item: [
        {
            text: 'Notes1',
            type: 'string',
            linkId: 'notes1',
        },
        {
            text: 'Notes2',
            type: 'string',
            linkId: 'notes2',
        },
        {
            item: [
                {
                    text: 'Notes3',
                    type: 'string',
                    linkId: 'notes3',
                },
            ],
            text: 'Over the last two weeks, how often have you been bothered by the following problems?',
            type: 'group',
            linkId: 'group-1',
        },
    ],
    resourceType: 'Questionnaire',
    title: 'Test',
    status: 'active',
    id: 'test',
    url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/test',
};

const q3Result: Questionnaire = {
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    item: [
        {
            text: 'Notes1',
            type: 'string',
            linkId: 'notes1',
        },
        {
            item: [
                {
                    text: 'Notes3',
                    type: 'string',
                    linkId: 'notes3',
                },
                {
                    text: 'Notes2',
                    type: 'string',
                    linkId: 'notes2',
                },
            ],
            text: 'Over the last two weeks, how often have you been bothered by the following problems?',
            type: 'group',
            linkId: 'group-1',
        },
    ],
    resourceType: 'Questionnaire',
    title: 'Test',
    status: 'active',
    id: 'test',
    url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/test',
};

const q4: Questionnaire = {
    item: [
        {
            text: 'Notes1',
            type: 'string',
            linkId: 'notes1',
        },
        {
            text: 'Notes2',
            type: 'string',
            linkId: 'notes2',
        },
        {
            text: 'Notes3',
            type: 'string',
            linkId: 'notes3',
        },
    ],
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    resourceType: 'Questionnaire',
    title: 'Test',
    status: 'active',
    id: 'test',
    url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/test',
};

const q4Result: Questionnaire = {
    item: [
        {
            text: 'Notes1',
            type: 'string',
            linkId: 'notes1',
        },
        {
            text: 'Notes3',
            type: 'string',
            linkId: 'notes3',
        },
        {
            text: 'Notes2',
            type: 'string',
            linkId: 'notes2',
        },
    ],
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    resourceType: 'Questionnaire',
    title: 'Test',
    status: 'active',
    id: 'test',
    url: 'https://aidbox.emr.beda.software/ui/console#/entities/Questionnaire/test',
};
