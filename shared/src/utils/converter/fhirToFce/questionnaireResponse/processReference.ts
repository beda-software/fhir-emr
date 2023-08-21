import { QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import { QuestionnaireResponse as FCEQuestionnaireResponse } from 'shared/src/contrib/aidbox';
import { fromFHIRReference } from 'shared/src/utils/converter';

export function processReference(fhirQuestionnaireResponse: FHIRQuestionnaireResponse): FCEQuestionnaireResponse {
    const { encounter, source, subject, ...commonProperties } = fhirQuestionnaireResponse;
    const fceQuestionnaireResponse: FCEQuestionnaireResponse = commonProperties as FCEQuestionnaireResponse;
    if (encounter?.reference) {
        fceQuestionnaireResponse.encounter = fromFHIRReference(encounter);
    }
    if (source?.reference) {
        fceQuestionnaireResponse.source = fromFHIRReference(source);
    }
    if (subject?.reference) {
        fceQuestionnaireResponse.subject = fromFHIRReference(subject);
    }
    return fceQuestionnaireResponse;
}
