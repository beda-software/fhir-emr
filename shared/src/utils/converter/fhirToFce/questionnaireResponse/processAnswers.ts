import {
    Coding as FHIRCoding,
    QuestionnaireResponseItem as FHIRQuestionnaireResponseItem,
    QuestionnaireResponseItemAnswer as FHIRQuestionnaireResponseItemAnswer,
    Reference as FHIRReference,
} from 'fhir/r4b';
import isEmpty from 'lodash/isEmpty';

import { QuestionnaireResponseItemAnswer as FCEQuestionnaireResponseItemAnswer } from 'shared/src/contrib/aidbox';
import { fromFHIRReference } from 'shared/src/utils/converter';

export function processAnswers(items: FHIRQuestionnaireResponseItem[]) {
    if (!items) {
        return;
    }
    for (const item of items) {
        if (item.answer) {
            item.answer = item.answer.map(processAnswer).filter((answer) => !isEmpty(answer));
        }
        if (item.item) {
            processAnswers(item.item);
        }
    }
}

function processAnswer(answer: FHIRQuestionnaireResponseItemAnswer): FCEQuestionnaireResponseItemAnswer {
    const fceAnswer: FCEQuestionnaireResponseItemAnswer = { ...answer };
    const valueHandlers = {
        valueString: (value: string) => ({ string: value }),
        valueInteger: (value: number) => ({ integer: value }),
        valueBoolean: (value: boolean) => ({ boolean: value }),
        valueCoding: (value: FHIRCoding) => ({ Coding: value }),
        valueDate: (value: string) => ({ date: value }),
        valueDateTime: (value: string) => ({ dateTime: value }),
        valueReference: (value: FHIRReference) => ({
            Reference: fromFHIRReference(value),
        }),
        valueTime: (value: string) => ({ time: value }),
    };

    for (const key in valueHandlers) {
        if (key in fceAnswer) {
            const value = fceAnswer[key];
            delete fceAnswer[key];
            fceAnswer.value = valueHandlers[key]?.(value);
        }
    }
    return fceAnswer;
}
