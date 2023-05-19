import { Questionnaire as FHIRQuestionnaire, QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

import { convertQuestionnaire } from './questionnaire';
import { convertQuestionnaireResponse } from './questionnaireResponse';

export function toFirstClassExtension(fhirQuestionnaireResponse: FHIRQuestionnaireResponse): FCEQuestionnaireResponse;
export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire;
export function toFirstClassExtension(fhirResource: FHIRQuestionnaire | FHIRQuestionnaireResponse): any {
    if (fhirResource.resourceType === 'Questionnaire') {
        return convertQuestionnaire(fhirResource);
    }
    if (fhirResource.resourceType === 'QuestionnaireResponse') {
        return convertQuestionnaireResponse(fhirResource);
    }
}
