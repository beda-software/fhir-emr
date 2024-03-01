import { Patient, Provenance, FhirResource } from 'fhir/r4b';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, resolveMap } from '@beda.software/remote-data';

import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/utils.tsx';
import { Query } from 'src/contexts/PatientDashboardContext';
import { getFHIRResources } from 'src/services/fhir';

export type PrepareFunction<T> =
    | ((resources: T[], provenances: Provenance[], total: number) => OverviewCard<T>)
    | ((resources: T[]) => OverviewCard<T[]>);

export function useStandardCard<T extends FhirResource>(
    patient: Patient,
    query: Query,
    prepareFunction: PrepareFunction<T>,
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

                const card: OverviewCard = prepareFunction(resource as T[], provenance, resource.length);
                return { card };
            },
        );
    }, []);

    return { response };
}
