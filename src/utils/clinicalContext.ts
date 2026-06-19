import { Bundle, Encounter, FhirResource, ParametersParameter } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { compileAsFirst } from './fhirpath';

const getPrimaryResource = compileAsFirst<Bundle, FhirResource>(
    'Bundle.entry.resource.where(resourceType=%resourceType).first()',
);

export function resourceToClinicalContext(
    name: string,
    resource: FhirResource,
    extraNames: string[] = [],
): ParametersParameter[] {
    const names = [name, name.toLowerCase(), ...extraNames];
    return names.map((n) => ({ name: n, resource }));
}

export function defaultToClinicalContext(resourceType: string, bundle: Bundle): ParametersParameter[] {
    const first = getPrimaryResource(bundle, { resourceType });
    if (!first) {
        console.warn(
            `[RenderBundleResourceContext] defaultToClinicalContext: no "${resourceType}" resource found in bundle. ` +
                `Clinical context will be empty. Pass a custom toClinicalContext prop if the resource type differs.`,
        );
        return [];
    }
    return resourceToClinicalContext(resourceType, first);
}

export function encounterToClinicalContext(encounter: WithId<Encounter>): ParametersParameter[] {
    return resourceToClinicalContext('Encounter', encounter, ['CurrentEncounter']);
}
