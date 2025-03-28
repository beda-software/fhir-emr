import { Resource } from 'fhir/r4b';

import { getReference } from 'aidbox-react/lib/services/fhir';

import { AidboxReference } from '@beda.software/aidbox-types';
import { ResourcesMap, SearchParams, extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess, RemoteDataResult } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';

export type LoadResourceOption<R extends Resource> = {
    value: {
        Reference: AidboxReference<R>;
    };
};

export async function loadResourceOptions<R extends Resource, IR extends Resource = any>(
    query: R['resourceType'],
    searchParams: SearchParams,
    referenceResource: Array<string> | undefined,
    getDisplayFn: (resource: R, includedResources: ResourcesMap<R | IR>) => string,
) {
    const result: RemoteDataResult<LoadResourceOption<R>[], any> = mapSuccess(
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
                        ...getReference(resource, getDisplayFn(resource as R, resourcesMap)),
                    },
                },
            }));
        },
    );

    return result;
}
