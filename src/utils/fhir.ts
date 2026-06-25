import { FhirResource, HumanName, Resource } from 'fhir/r4b';

export function renderHumanName(name?: HumanName) {
    if (!name) {
        return 'Unnamed';
    }

    return (
        `${name?.prefix?.[0] ?? ''} ${name?.given?.[0] ?? ''} ${name?.family ?? ''} ${
            name?.suffix?.[0] ?? ''
        } `.trim() ||
        name.text ||
        'Unnamed'
    );
}

export function isFhirResource(resource: Resource): resource is FhirResource {
    return typeof resource.resourceType === 'string' && resource.resourceType.length > 0;
}
