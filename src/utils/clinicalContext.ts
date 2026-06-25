import { Encounter, FhirResource, ParametersParameter, Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { isFhirResource } from 'src/utils';

export function resourceToClinicalContext(
    name: string,
    resource: FhirResource,
    extraNames: string[] = [],
): ParametersParameter[] {
    const names = [name, name.toLowerCase(), ...extraNames];
    return names.map((n) => ({ name: n, resource }));
}

export function toClinicalContextDefault<R extends Resource>(context: RecordType<R>): ParametersParameter[] {
    const { resource } = context;
    if (!isFhirResource(resource)) {
        return [];
    }
    return resourceToClinicalContext(resource.resourceType, resource);
}

export function encounterToClinicalContext(encounter: WithId<Encounter>): ParametersParameter[] {
    return resourceToClinicalContext('Encounter', encounter, ['CurrentEncounter']);
}
