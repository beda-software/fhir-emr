import { Bundle, Reference, Resource } from 'fhir/r4b';

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

export function resolveReference<R extends Resource = never>(bundle: Bundle, reference: Reference): R | undefined {
    return bundle.entry?.find((entry) => reference.reference && entry.fullUrl?.endsWith(reference.reference))
        ?.resource as R | undefined;
}
