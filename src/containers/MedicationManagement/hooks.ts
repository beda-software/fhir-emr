import { Medication, MedicationKnowledge, MedicationRequest, Organization, Patient, Practitioner } from 'fhir/r4b';
import { SearchParams } from 'fhir-react';

import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';

export function useMedicationList(searchParameters: SearchParams) {
    const queryParameters = searchParameters ?? {};

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Medication,
        StringTypeColumnFilterValue[]
    >('Medication', queryParameters);

    const medicationResponse = mapSuccess(resourceResponse, (bundle) => extractBundleResources(bundle).Medication);

    return {
        pagination,
        medicationResponse,
        pagerManager,
        handleTableChange,
    };
}

export function useMedicationKnowledge() {
    const queryParameters = {};

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        MedicationKnowledge,
        StringTypeColumnFilterValue[]
    >('MedicationKnowledge', queryParameters);

    const medicationKnowledgeResponse = mapSuccess(
        resourceResponse,
        (bundle) => extractBundleResources(bundle).MedicationKnowledge,
    );

    return {
        pagination,
        medicationKnowledgeResponse,
        pagerManager,
        handleTableChange,
    };
}

export function useMedicationRequest(searchParameters: SearchParams) {
    const queryParameters = searchParameters ?? {};

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        MedicationRequest | Patient | Organization | Practitioner | Medication,
        StringTypeColumnFilterValue[]
    >('MedicationRequest', queryParameters);

    const medicationRequestResponse = mapSuccess(resourceResponse, (bundle) => {
        return {
            medicationRequest: extractBundleResources(bundle).MedicationRequest,
            patient: extractBundleResources(bundle).Patient,
            organization: extractBundleResources(bundle).Organization,
            practitioner: extractBundleResources(bundle).Practitioner,
            medication: extractBundleResources(bundle).Medication,
        };
    });

    return {
        pagination,
        medicationRequestResponse,
        pagerManager,
        handleTableChange,
    };
}
