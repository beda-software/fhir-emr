import { QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import { QuestionnaireResponse as FCEQuestionnaireResponse } from '@beda.software/aidbox-types';

export function processReference(fceQR: FCEQuestionnaireResponse): FHIRQuestionnaireResponse {
    const { encounter, source, subject, ...commonProprties } = fceQR;
    const fhirQuestionnaireResponse: FHIRQuestionnaireResponse = commonProprties as FHIRQuestionnaireResponse;
    if (encounter && encounter.resourceType && encounter.id) {
        const { id, resourceType, ...encounterProperties } = encounter;
        fhirQuestionnaireResponse.encounter = { reference: `${resourceType}/${id}`, ...encounterProperties };
    }
    if (source && source.resourceType && source.id) {
        const { id, resourceType, ...sourceProperties } = source;
        fhirQuestionnaireResponse.source = { reference: `${resourceType}/${id}`, ...sourceProperties };
    }
    if (subject && subject.resourceType && subject.id) {
        const { id, resourceType, ...subjectProperties } = subject;
        fhirQuestionnaireResponse.subject = { reference: `${resourceType}/${id}`, ...subjectProperties };
    }
    return fhirQuestionnaireResponse;
}
