import { Resource } from 'fhir/r4b';

import { getReference } from 'aidbox-react/lib/services/fhir';

import { ResourcesMap, SearchParams, extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';

export async function loadResourceOptions<R extends Resource, IR extends Resource = any>(
    query: R['resourceType'],
    searchParams: SearchParams,
    getDisplayFn: (resource: R, includedResources: ResourcesMap<R | IR>) => string,
) {
    return mapSuccess(await getFHIRResources<R | IR>(query, searchParams), (bundle) => {
        const resourcesMap = extractBundleResources(bundle);
        let resourceType = query;
        if (resourceType.endsWith('/$has')) {
            resourceType = resourceType?.slice(0, -5);
        }

        return resourcesMap[resourceType].map((resource) => ({
            value: {
                Reference: {
                    ...getReference(resource, getDisplayFn(resource as R, resourcesMap)),
                },
            },
        }));
    });
}
