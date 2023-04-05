import { Provenance } from 'fhir/r4b';

import { RemoteDataResult } from 'aidbox-react/lib/libs/remoteData';
import { WithId } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, service } from 'aidbox-react/lib/services/service';

type ProvenanceResponse = {
    data: Array<{ resource: WithId<Provenance> }>;
};

function onSuccess(response: RemoteDataResult<ProvenanceResponse>) {
    return mapSuccess(response, (data) => data.data.map((d) => d.resource));
}

export async function getProvenanceByEntity(source: string) {
    const response = await service<ProvenanceResponse>({
        url: `/$query/provenance-by-source`,
        method: 'GET',
        params: { source },
    });

    return onSuccess(response);
}

export async function getProvenanceByTarget(target: string) {
    const response = await service<ProvenanceResponse>({
        url: `/$query/provenance-by-target`,
        method: 'GET',
        params: { target },
    });

    return onSuccess(response);
}
