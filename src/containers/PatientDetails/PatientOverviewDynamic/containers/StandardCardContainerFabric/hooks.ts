import { Patient, Provenance, FhirResource } from 'fhir/r4b';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, resolveMap } from '@beda.software/remote-data';

import { Query } from 'src/components/Dashboard/types';
import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import { getFHIRResources } from 'src/services/fhir';

export type PrepareFunction =
    | ((resources: FhirResource[], provenances: Provenance[], total: number) => OverviewCard<FhirResource>)
    | ((resources: FhirResource[]) => OverviewCard<FhirResource[]>);

export function useStandardCard(patient: Patient, query: Query, prepareFunction: PrepareFunction) {
    const [response] = useService(async () => {
        return mapSuccess(
            await resolveMap({
                resourceBundle: getFHIRResources<FhirResource>(query.resourceType, query.search(patient)),
            }),
            ({ resourceBundle }) => {
                const resources = extractBundleResources(resourceBundle);
                const resource = resources[query.resourceType];
                const provenance = resources.Provenance;

                const card: OverviewCard<FhirResource> | OverviewCard<FhirResource[]> = prepareFunction(
                    resource as FhirResource[],
                    provenance,
                    resource.length,
                );
                return { card };
            },
        );
    }, []);

    return { response };
}
