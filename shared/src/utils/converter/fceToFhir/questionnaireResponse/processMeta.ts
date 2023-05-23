import { Meta as FHIRMeta } from 'fhir/r4b';

import { Meta as FCEMeta } from 'shared/src/contrib/aidbox';

export function processMeta(meta: FCEMeta): FHIRMeta {
    const { createdAt, ...fhirMeta } = meta;
    if (createdAt) {
        fhirMeta.extension = [
            {
                url: 'ex:createdAt',
                valueInstant: meta.createdAt,
            },
        ];
    }
    return fhirMeta;
}
