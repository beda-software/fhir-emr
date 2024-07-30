import { Questionnaire as FHIRQuestionnaire, QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
} from '@beda.software/aidbox-types';

import { convertQuestionnaire } from './questionnaire';
import { convertQuestionnaireResponse } from './questionnaireResponse';

export function fromFirstClassExtension(fceQuestionnaireResponse: FCEQuestionnaireResponse): FHIRQuestionnaireResponse;
export function fromFirstClassExtension(fceQuestionnaire: FCEQuestionnaire): FHIRQuestionnaire;
export function fromFirstClassExtension(
    fceResource: FCEQuestionnaire | FCEQuestionnaireResponse,
): FHIRQuestionnaireResponse | FHIRQuestionnaire {
    switch (fceResource.resourceType) {
        case 'Questionnaire':
            return convertQuestionnaire(fceResource);
        case 'QuestionnaireResponse':
            return convertQuestionnaireResponse(fceResource);
    }
}
