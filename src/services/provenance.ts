import { RemoteDataResult, mapSuccess } from '@beda.software/remote-data';

import { aidboxService } from 'src/services/fhir';

type ProvenanceResponse<T> = {
    data: Array<{ resource: T }>;
};

function onSuccess<T>(response: RemoteDataResult<ProvenanceResponse<T>>) {
    return mapSuccess(response, (data) => data.data.map((d) => d.resource));
}

export async function getProvenanceByEntity<T>(source: string) {
    const response = await aidboxService<ProvenanceResponse<T>>({
        url: `/$query/provenance-by-source`,
        method: 'GET',
        params: { source },
    });

    return onSuccess<T>(response);
}

export async function getProvenanceByTarget<T>(target: string) {
    const response = await aidboxService<ProvenanceResponse<T>>({
        url: `/$query/provenance-by-target`,
        method: 'GET',
        params: { target },
    });

    return onSuccess<T>(response);
}
