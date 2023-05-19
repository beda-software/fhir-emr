import { Questionnaire as FHIRQuestionnaire, QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

import { convertQuestionnaire } from './questionnaire';
import { convertQuestionnaireResponse } from './questionnaireResponse';

export function fromFirstClassExtension(fceQuestionnaireResponse: FCEQuestionnaireResponse): FHIRQuestionnaireResponse;
export function fromFirstClassExtension(fceQuestionnaire: FCEQuestionnaire): FHIRQuestionnaire;
export function fromFirstClassExtension(fceResource: FCEQuestionnaire | FCEQuestionnaireResponse): any {
    if (fceResource.resourceType === 'Questionnaire') {
        return convertQuestionnaire(fceResource);
    }
    if (fceResource.resourceType === 'QuestionnaireResponse') {
        return convertQuestionnaireResponse(fceResource);
    }
}
