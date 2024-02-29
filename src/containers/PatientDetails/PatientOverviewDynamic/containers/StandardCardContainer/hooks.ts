import {
    AllergyIntolerance,
    Immunization,
    MedicationStatement,
    Observation,
    Patient,
    Condition,
    Consent,
    ServiceRequest,
} from 'fhir/r4b';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, resolveMap } from '@beda.software/remote-data';

import {
    prepareAllergies,
    prepareImmunizations,
    prepareMedications,
    prepareConditions,
    prepareConsents,
    prepareActivitySummary,
    prepareSeriveRequest,
    OverviewCard,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/utils.tsx';
import { Query, Resource } from 'src/contexts/PatientDashboardContext';
import { getFHIRResources } from 'src/services/fhir';

export function useStandardCard(patient: Patient, query: Query) {
    const [response] = useService(async () => {
        return mapSuccess(
            await resolveMap({
                resourceBundle: getFHIRResources<Resource>(query.resourceType, query.search(patient)),
            }),
            ({ resourceBundle }) => {
                const resource = extractBundleResources(resourceBundle)[query.resourceType];
                const provenance = extractBundleResources(resourceBundle).Provenance;

                let card: OverviewCard;
                switch (query.resourceType) {
                    case 'AllergyIntolerance':
                        card = prepareAllergies(resource as AllergyIntolerance[], provenance, resource.length);
                        break;
                    case 'Condition':
                        card = prepareConditions(resource as Condition[], provenance, resource.length);
                        break;
                    case 'Immunization':
                        card = prepareImmunizations(resource as Immunization[], provenance, resource.length);
                        break;
                    case 'MedicationStatement':
                        card = prepareMedications(resource as MedicationStatement[], provenance, resource.length);
                        break;
                    case 'Consent':
                        card = prepareConsents(resource as Consent[], provenance, resource.length);
                        break;
                    case 'Observation':
                        card = prepareActivitySummary(resource as Observation[]);
                        break;
                    case 'ServiceRequest':
                        card = prepareSeriveRequest(resource as ServiceRequest[], resource.length);
                        break;
                    default:
                        throw new Error(`Invalid resource`);
                }
                return { card };
            },
        );
    }, []);

    return { response };
}
