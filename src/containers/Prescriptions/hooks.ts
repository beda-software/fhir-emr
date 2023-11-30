import { Medication, MedicationRequest, Organization, Patient, Practitioner } from 'fhir/r4b';
import { SearchParams } from 'fhir-react';

import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';

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
