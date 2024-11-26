import { Patient, FhirResource, Resource } from 'fhir/r4b';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, resolveMap } from '@beda.software/remote-data';

import { Query } from 'src/components/Dashboard/types';
import {
    OverviewCard,
    PrepareFunction,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import { getFHIRResources } from 'src/services/fhir';

export function useStandardCard<T extends Resource>(
    patient: Patient,
    query: Query,
    prepareFunction: PrepareFunction<T>,
    to?: string,
) {
    const [response] = useService(async () => {
        return mapSuccess(
            await resolveMap({
                resourceBundle: getFHIRResources<FhirResource>(query.resourceType, query.search(patient)),
            }),
            ({ resourceBundle }) => {
                const resources = extractBundleResources(resourceBundle);
                const resource = resources[query.resourceType];
                const provenance = resources.Provenance;

                const card: OverviewCard<T> | OverviewCard<T[]> = prepareFunction(
                    resource as T[],
                    provenance,
                    resource.length,
                    to,
                );
                return { card };
            },
        );
    }, []);

    return { response };
}
