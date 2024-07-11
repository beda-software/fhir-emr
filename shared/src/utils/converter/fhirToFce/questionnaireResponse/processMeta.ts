import { Meta as FHIRMeta } from 'fhir/r4b';

import { Meta as FCEMeta } from 'shared/src/contrib/aidbox';
import { extractExtension } from 'shared/src/utils/converter';

export function processMeta(meta: FHIRMeta): FCEMeta {
    const { extension, ...commonMeta } = meta;
    const fceMeta: FCEMeta = { ...commonMeta };
    if (extension) {
        fceMeta.createdAt = extractExtension(extension, 'ex:createdAt');
        const filteredExtension = extension.filter((value) => value.url !== 'ex:createdAt');
        if (filteredExtension?.length > 0) fceMeta.extension = filteredExtension;
    }
    return fceMeta;
}
