export function processReference(fhirQuestionnaireResponse: any) {
    if (fhirQuestionnaireResponse.encounter && fhirQuestionnaireResponse.encounter.reference) {
        const [resourceType, id] = fhirQuestionnaireResponse.encounter.reference.split('/');
        fhirQuestionnaireResponse.encounter = {
            resourceType,
            id,
        };
    }
    if (fhirQuestionnaireResponse.source && fhirQuestionnaireResponse.source.reference) {
        const [resourceType, id] = fhirQuestionnaireResponse.source.reference.split('/');
        fhirQuestionnaireResponse.source = {
            resourceType,
            id,
        };
    }
}
