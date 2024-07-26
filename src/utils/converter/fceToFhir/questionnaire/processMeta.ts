import { Meta as FHIRMeta } from 'fhir/r4b';

import { Meta as FCEMeta } from '@beda.software/aidbox-types';

export function processMeta(meta: FCEMeta): FHIRMeta {
    const { createdAt, ...fhirMeta } = meta;

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
