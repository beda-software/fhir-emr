import {
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireItemEnableWhen,
    QuestionnaireResponse,
    QuestionnaireResponseItem,
} from '@beda.software/aidbox-types';

import { evaluate, questionnaireItemsToValidationSchema } from 'src/utils';

export type QuestionnaireData = {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse;
};

export const CONTROL_ITEM_LINK_ID = 'control-item';

interface GenerateQAndQRDataProps {
    type: QuestionnaireItem['type'];
    enableWhen: QuestionnaireItemEnableWhen[];
    enableBehavior?: QuestionnaireItem['enableBehavior'];
    qrItem: QuestionnaireResponseItem[];
}
export function generateQAndQRData(
    props: GenerateQAndQRDataProps,
): Pick<QuestionnaireData, 'questionnaire' | 'questionnaireResponse'> {
    const { type, enableWhen, enableBehavior, qrItem } = props;

    return {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'questionnaire',
            title: 'Questionnaire',
            status: 'active',
            item: [
                {
                    linkId: 'q1',
                    type: type,
                    text: 'Item to check 1',
                    required: false,
                },
                {
                    linkId: 'q2',
                    type: type,
                    text: 'Item to check 2',
                    required: false,
                },
                {
                    linkId: CONTROL_ITEM_LINK_ID,
                    type: type,
                    text: 'Control item',
                    required: true,
                    enableWhen,
                    enableBehavior,
                },
            ],
        },
        questionnaireResponse: {
            resourceType: 'QuestionnaireResponse',
            status: 'completed',
            item: qrItem,
        },
    };
}

export const ENABLE_WHEN_TESTS_TITLE = 'Should check if CONTROL_ITEM_LINK_ID is required or not';

export async function testEnableWhenCases(questionnaireData: QuestionnaireData) {
    const { questionnaire, questionnaireResponse } = questionnaireData;

    const qrValues: QuestionnaireResponseItem[] = evaluate(questionnaireResponse, `item`);
    const values = qrValues.reduce(
        (acc, item) => {
            acc[item.linkId] = item.answer;
            return acc;
        },
        {} as Record<string, any>,
    );
    const schema = questionnaireItemsToValidationSchema(questionnaire.item!);

    // NOTE: A way to debug a schema errors
    // try {
    //     schema.validateSync(values);
    // } catch (e) {
    //     console.log('Test schema valiadtion errors:', e);
    // }

    expect(schema.isValidSync(values)).toBeTruthy();
}
