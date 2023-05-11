import { QuestionnaireResponse as FCEQuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { processAnswers } from './processAnswers';
import { processMeta } from './processMeta';
import { processReference } from './processReference';

export const convertQuestionnaireResponse = (fhirResource: any) => {
    const questionnaireResponse = JSON.parse(JSON.stringify(fhirResource));
    processAnswers(questionnaireResponse.item);
    if (questionnaireResponse.meta) {
        processMeta(questionnaireResponse.meta);
    }
    processReference(questionnaireResponse);
    return questionnaireResponse as unknown as FCEQuestionnaireResponse;
};
