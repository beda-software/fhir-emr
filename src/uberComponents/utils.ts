import { Bundle, Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { ResourceContext } from './types';

export function resourceToCTX<R extends Resource>(resource: R, bundle: Bundle<R>): ResourceContext<R> {
    const resourceData = resource as WithId<R>;
    const bundleData = bundle as Bundle;
    return {
        resource: resourceData,
        bundle: bundleData,
    };
}
