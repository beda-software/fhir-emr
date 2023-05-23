import { QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';
import cloneDeep from 'lodash/cloneDeep';

import { QuestionnaireResponse as FCEQuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { processAnswers } from './processAnswers';
import { processMeta } from './processMeta';
import { processReference } from './processReference';

export function convertQuestionnaireResponse(
    questionnaireResponse: FCEQuestionnaireResponse,
): FHIRQuestionnaireResponse {
    questionnaireResponse = cloneDeep(questionnaireResponse);
    if (questionnaireResponse.item) {
        processAnswers(questionnaireResponse.item);
    }
    questionnaireResponse.meta = questionnaireResponse.meta
        ? processMeta(questionnaireResponse.meta)
        : questionnaireResponse.meta;
    return processReference(questionnaireResponse);
}
