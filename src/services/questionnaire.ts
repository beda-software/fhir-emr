import { Reference, Resource } from 'fhir/r4b';

import { ResourcesMap, SearchParams, extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess, RemoteDataResult } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';

export type LoadResourceOption = {
    value: {
        Reference: Reference;
    };
};

export async function loadResourceOptions<R extends Resource, IR extends Resource = any>(
    query: R['resourceType'],
    searchParams: SearchParams,
    referenceResource: Array<string> | undefined,
    getDisplayFn: (resource: R, includedResources: ResourcesMap<R | IR>) => string,
) {
    const result: RemoteDataResult<LoadResourceOption[], any> = mapSuccess(
        await getFHIRResources<R | IR>(query, searchParams),
        (bundle) => {
            const resourcesMap = extractBundleResources(bundle);
            let resourceType = query;
            if (referenceResource && referenceResource.length === 1) {
                resourceType = referenceResource![0]!;
            }
            if (resourceType.endsWith('/$has')) {
                resourceType = resourceType?.slice(0, -5);
            }

            return resourcesMap[resourceType].map((resource) => ({
                value: {
                    Reference: {
                        reference: `${resource.resourceType}/${resource.id}`,
                        display: getDisplayFn(resource as R, resourcesMap),
                    },
                },
            }));
        },
    );

    return result;
}
