import { QuestionnaireResponse } from 'fhir/r4b';
import { FCEQuestionnaire, FCEQuestionnaireItem, ItemContext, mapResponseToForm } from 'sdc-qrf';

import { getAllGroupQuestionsWithAnswerStatus } from '../utils';

function questionFactory(linkId: string, extra?: Partial<FCEQuestionnaireItem>): FCEQuestionnaireItem {
    return {
        linkId,
        text: linkId,
        type: 'string',
        ...(extra ?? {}),
    };
}

function groupFactory(
    linkId: string,
    items: FCEQuestionnaireItem[],
    extra?: Partial<FCEQuestionnaireItem>,
): FCEQuestionnaireItem {
    return {
        linkId,
        text: linkId,
        type: 'group',
        item: items,
        ...(extra ?? {}),
    };
}
function questionnaireFactory(items: FCEQuestionnaireItem[]): FCEQuestionnaire {
    return {
        resourceType: 'Questionnaire',
        status: 'active',
        item: items,
    };
}

describe('getAllGroupQuestionsWithAnswerStatus', () => {
    it('should return all questions with answer status', () => {
        const questionnaire = questionnaireFactory([
            groupFactory('root', [
                questionFactory('q1'),
                questionFactory('q2'),
                groupFactory('g1', [questionFactory('g1-q1'), questionFactory('g1-q2')]),
                groupFactory('g2', [questionFactory('g2-q1'), questionFactory('g2-q2')], { repeats: true }),
            ]),
        ]);
        const qr: QuestionnaireResponse = {
            resourceType: 'QuestionnaireResponse',
            status: 'completed',
            item: [
                {
                    linkId: 'root',
                    item: [
                        { linkId: 'q1', answer: [{ valueString: 'answer' }] },
                        { linkId: 'g1', item: [{ linkId: 'g1-q1', answer: [{ valueString: 'answer' }] }] },
                        { linkId: 'g2', item: [{ linkId: 'g2-q1', answer: [{ valueString: 'answer' }] }] },
                    ],
                },
            ],
        };

        const formValues = mapResponseToForm(qr, questionnaire);
        const context: ItemContext = {
            resource: qr,
            questionnaire,
            context: qr,
            qitem: questionnaire.item![0]!,
        };
        const result = getAllGroupQuestionsWithAnswerStatus(questionnaire.item![0]!, [], formValues, context);
        expect(result).toEqual([
            [questionFactory('q1'), true],
            [questionFactory('q2'), false],
            [questionFactory('g1-q1'), true],
            [questionFactory('g1-q2'), false],
            [questionFactory('g2-q1'), true],
            [questionFactory('g2-q2'), false],
        ]);
    });
});
