import { Resource } from 'fhir/r4b';

import { getReference } from 'aidbox-react/lib/services/fhir';

import { ResourcesMap, SearchParams, extractBundleResources, mapSuccess } from '@beda.software/fhir-react';

import { getFHIRResources } from 'src/services/fhir';

export async function loadResourceOptions<R extends Resource, IR extends Resource = any>(
    resourceType: R['resourceType'],
    searchParams: SearchParams,
    getDisplayFn: (resource: R, includedResources: ResourcesMap<R | IR>) => string,
) {
    return mapSuccess(await getFHIRResources<R | IR>(resourceType, searchParams), (bundle) => {
        const resourcesMap = extractBundleResources(bundle);
        return resourcesMap[resourceType].map((resource) => ({
            value: {
                Reference: {
                    ...getReference(resource, getDisplayFn(resource as R, resourcesMap)),
                },
            },
        }));
    });
}
