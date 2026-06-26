import { ParametersParameter, Resource } from 'fhir/r4b';

import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { getResourceClinicalContext } from 'src/utils';

export function getRecordClinicalContextDefault<R extends Resource>(
    resourceType: R['resourceType'],
    record: RecordType<R> | undefined,
): ParametersParameter[] {
    if (!record) {
        return getResourceClinicalContext(resourceType, {} as Resource);
    }

    const { resource } = record;
    return getResourceClinicalContext(resource.resourceType, resource);
}
