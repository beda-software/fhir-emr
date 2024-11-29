import {
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireItemEnableWhenAnswer,
    QuestionnaireResponse,
} from '@beda.software/aidbox-types';

import { EnableWhenOperator } from 'src/utils/enableWhen';

export type QuestionnaireData = {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse;
    enabled: boolean;
};

export const ITEM_TO_CKECK_LINK_ID = 'item-to-check';
export const CONTROL_ITEM_LINK_ID = 'control-item';

interface GenerateQAndQRDataProps {
    type: QuestionnaireItem['type'];
    operator: EnableWhenOperator;
    conditionValue: QuestionnaireItemEnableWhenAnswer;
    answerValue: QuestionnaireItemEnableWhenAnswer;
}

export function generateQAndQRData(
    props: GenerateQAndQRDataProps,
): Pick<QuestionnaireData, 'questionnaire' | 'questionnaireResponse'> {
    const { type, operator, conditionValue, answerValue } = props;

    return {
        questionnaire: {
            resourceType: 'Questionnaire',
            id: 'questionnaire',
            title: 'Questionnaire',
            status: 'active',
            item: [
                {
                    linkId: ITEM_TO_CKECK_LINK_ID,
                    type: type,
                    text: 'Item to check',
                    required: false,
                },
                {
                    linkId: CONTROL_ITEM_LINK_ID,
                    type: type,
                    text: 'Control item',
                    required: true,
                    enableWhen: [
                        {
                            question: ITEM_TO_CKECK_LINK_ID,
                            operator,
                            answer: conditionValue,
                        },
                    ],
                },
            ],
        },
        questionnaireResponse: {
            resourceType: 'QuestionnaireResponse',
            status: 'completed',
            item: [
                {
                    linkId: ITEM_TO_CKECK_LINK_ID,
                    answer: [{ value: answerValue }],
                },
            ],
        },
    };
}
