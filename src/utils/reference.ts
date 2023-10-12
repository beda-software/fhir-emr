import { Reference } from 'fhir/r4b';

export function getFHIRReferenceData(reference?: Reference) {
    const splittedReference = reference?.reference?.split('/');
    return {
        resourceType: splittedReference?.[0],
        id: splittedReference?.[1],
    };
}

export function getFHIRReferenceResourceType(reference?: Reference) {
    return getFHIRReferenceData(reference).resourceType;
}

export function getFHIRReferenceResourceId(reference?: Reference) {
    return getFHIRReferenceData(reference).id;
}
