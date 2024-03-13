import { Observation } from 'fhir/r4b';
import { useState } from 'react';

import { extractBundleResources, useService, SearchParams } from '@beda.software/fhir-react';
import { loading, mapSuccess, RemoteData } from '@beda.software/remote-data';

import { ObservationWithDate } from 'src/components/DashboardCard/creatinine';
import { getFHIRResources } from 'src/services/fhir';

export function useCreatinineDashboard(searchParams: SearchParams) {
    const [creatinineObservations, setCreatinineObservations] =
        useState<RemoteData<Array<ObservationWithDate>>>(loading);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_creatinine, manager] = useService(async () => {
        const result = mapSuccess(await getFHIRResources<Observation>('Observation', searchParams), (data) => {
            const observations = (extractBundleResources(data).Observation ?? []).map((o) => {
                const r: ObservationWithDate = {
                    ...o,
                    effective: new Date(o.effectiveDateTime!),
                };
                return r;
            });
            return observations;
        });
        setCreatinineObservations(result);
        return result;
    }, []);

    return { creatinineObservations, reloadCreatinineObservations: manager.reload };
}
