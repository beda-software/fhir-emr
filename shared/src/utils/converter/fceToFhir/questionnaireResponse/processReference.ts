import { QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import { QuestionnaireResponse as FCEQuestionnaireResponse } from 'shared/src/contrib/aidbox';

export function processReference(fceQR: FCEQuestionnaireResponse): FHIRQuestionnaireResponse {
    const { encounter, source, ...commonProprties } = fceQR;
    const fhirQuestionnaireResponse: FHIRQuestionnaireResponse = commonProprties as FHIRQuestionnaireResponse;
    if (encounter && encounter.resourceType && encounter.id) {
        const { id, resourceType, ...encounterProperties } = encounter;
        fhirQuestionnaireResponse.encounter = { reference: `${resourceType}/${id}`, ...encounterProperties };
    }
    if (source && source.resourceType && source.id) {
        const { id, resourceType, ...sourceProperties } = source;
        fhirQuestionnaireResponse.source = { reference: `${resourceType}/${id}`, ...sourceProperties };
    }
    return fhirQuestionnaireResponse;
}
