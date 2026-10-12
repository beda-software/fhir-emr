import { Bundle, Resource, Slot } from 'fhir/r4b';

import { SearchParams, WithId } from '@beda.software/fhir-react';

import { service, getFHIRResources } from 'src/services/fhir';

export async function getSlots(operationUrl?: string, searchParams?: SearchParams) {
    return service<Bundle<WithId<Slot>>>({
        method: 'GET',
        url: operationUrl ?? '/Slot',
        params: searchParams,
    });
}

export async function getMainResources<R extends Resource>(
    resourceType: R['resourceType'],
    searchParams?: SearchParams,
) {
    return await getFHIRResources<R>(resourceType, searchParams ?? {});
}
