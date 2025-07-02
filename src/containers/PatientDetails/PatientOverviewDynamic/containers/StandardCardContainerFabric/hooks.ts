import { Patient, Resource } from 'fhir/r4b';

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
    const countNumber = Number(query.search(patient)?._count) || 7;
    const searchParams = { ...query.search(patient), ...{ _count: countNumber } };
    const [response, manager] = useService(async () => {
        return mapSuccess(
            await resolveMap({
                resourceBundle: getFHIRResources<T>(query.resourceType, searchParams),
            }),
            ({ resourceBundle }) => {
                const resources = extractBundleResources(resourceBundle);
                const resource = resources[query.resourceType];

                const card: OverviewCard<T> | OverviewCard<T[]> = prepareFunction(
                    resource as T[],
                    resourceBundle,
                    resource.length,
                    to,
                );
                return { card };
            },
        );
    }, []);

    return { response, manager, countNumber };
}
