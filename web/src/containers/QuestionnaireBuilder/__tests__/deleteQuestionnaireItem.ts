import { Questionnaire } from 'fhir/r4b';

import { deleteQuestionnaireItem } from '../utils';

describe('deleteQuestionnaireItem test', () => {
    test('delete item on a top Questionnaire item level', () => {
        const result = deleteQuestionnaireItem(q1, {
            questionItem: {
                text: 'Notes2',
                type: 'string',
                linkId: 'notes2',
            },
            parentPath: [],
        });

        expect(result).toEqual(q1Result);
    });

    test('delete item from Group', () => {
        const result = deleteQuestionnaireItem(q2, {
            questionItem: {
                text: 'Notes2',
                type: 'string',
                linkId: 'notes2',
            },
            parentPath: ['group-1', 'items'],
        });

        expect(result).toEqual(q2Result);
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
