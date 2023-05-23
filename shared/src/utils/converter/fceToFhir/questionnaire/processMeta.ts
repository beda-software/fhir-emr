import { Meta as FHIRMeta } from 'fhir/r4b';

import { Meta as FCEMeta } from 'shared/src/contrib/aidbox';

export function processMeta(meta: FCEMeta): FHIRMeta {
    let { createdAt, ...fhirMeta } = meta;

    if (createdAt) {
        fhirMeta.extension = [
            ...(meta.extension ?? []),
            {
                url: 'ex:createdAt',
                valueInstant: createdAt,
            },
        ];
    }

    return fhirMeta;
}
