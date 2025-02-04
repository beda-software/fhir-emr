import { Provenance } from 'fhir/r4b';

import { useService } from '@beda.software/fhir-react';
import { failure, isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getProvenanceByTargetId } from 'src/services/provenance';

export function useLinkToEdit(props: { resourceId?: string }) {
    const [response] = useService(async () => {
        if (!props.resourceId) {
            return failure('No resource requested');
        }
        return mapSuccess(await getProvenanceByTargetId<Provenance>(props.resourceId), (data) => data);
    }, [props.resourceId]);

    if (isSuccess(response)) {
        return response.data[0];
    }
}
