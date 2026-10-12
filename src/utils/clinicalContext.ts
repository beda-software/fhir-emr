import { FhirResource, ParametersParameter, Resource } from 'fhir/r4b';

export function getResourceClinicalContext(
    name: string,
    resource: Resource,
    extraNames: string[] = [],
): ParametersParameter[] {
    const names = [name, name.toLowerCase(), ...extraNames];

    return names.map((n) => ({ name: n, resource: resource as FhirResource }));
}
