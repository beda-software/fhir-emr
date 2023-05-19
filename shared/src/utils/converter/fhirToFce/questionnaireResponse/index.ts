import { QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';
import cloneDeep from 'lodash/cloneDeep';

import { QuestionnaireResponse as FCEQuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { processAnswers } from './processAnswers';
import { processMeta } from './processMeta';
import { processReference } from './processReference';

export function convertQuestionnaireResponse(
    questionnaireResponse: FHIRQuestionnaireResponse,
): FCEQuestionnaireResponse {
    questionnaireResponse = cloneDeep(questionnaireResponse);
    processAnswers(questionnaireResponse.item);
    if (questionnaireResponse.meta) {
        processMeta(questionnaireResponse.meta);
    }
    processReference(questionnaireResponse);
    return questionnaireResponse as unknown as FCEQuestionnaireResponse;
}
