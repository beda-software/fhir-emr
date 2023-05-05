import { QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import { processAnswers } from './processAnswers';
import { processMeta } from './processMeta';
import { processReference } from './processReference';

export const convertQuestionnaireResponse = (fceResource: any) => {
    const questionnaireResponse = JSON.parse(JSON.stringify(fceResource));
    processAnswers(questionnaireResponse.item);
    processMeta(questionnaireResponse.meta);
    processReference(questionnaireResponse);
    return questionnaireResponse as unknown as FHIRQuestionnaireResponse;
};
