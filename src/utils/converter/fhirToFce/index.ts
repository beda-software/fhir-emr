import { Questionnaire as FHIRQuestionnaire, QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
} from '@beda.software/aidbox-types';

import { convertQuestionnaire } from './questionnaire';
import { convertQuestionnaireResponse } from './questionnaireResponse';

export function toFirstClassExtension(fhirQuestionnaireResponse: FHIRQuestionnaireResponse): FCEQuestionnaireResponse;
export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire;
export function toFirstClassExtension(
    fhirResource: FHIRQuestionnaire | FHIRQuestionnaireResponse,
): FCEQuestionnaireResponse | FCEQuestionnaire {
    switch (fhirResource.resourceType) {
        case 'Questionnaire':
            return convertQuestionnaire(fhirResource);
        case 'QuestionnaireResponse':
            return convertQuestionnaireResponse(fhirResource);
    }
}
