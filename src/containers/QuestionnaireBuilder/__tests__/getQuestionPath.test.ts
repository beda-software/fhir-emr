import { Questionnaire } from '@beda.software/aidbox-types';

import { getQuestionPath } from '../utils';

describe('getQuestionPath test', () => {
    test('getting path for tope level QuestionItem', () => {
        const result = getQuestionPath(
            q1,
            {
                text: 'Notes2',
                type: 'string',
                linkId: 'notes2',
            },
            [],
        );
        expect(result).toEqual(['item', 1]);
    });

    test('getting path for QuestionItem in group', () => {
        const result = getQuestionPath(
            q2,
            {
                text: 'Notes3',
                type: 'string',
                linkId: 'notes3',
            },
            ['group-1', 'items'],
        );
        expect(result).toEqual(['item', 1, 'item', 1]);
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
