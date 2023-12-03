import { Medication, MedicationRequest, Organization, Patient, Practitioner } from 'fhir/r4b';

import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';

export function useMedicationRequest(requesterId?: string, subjectId?: string, status?: string) {
    const queryParameters = {
        requester: requesterId,
        patient: subjectId,
        status: status,
        _include: [
            'MedicationRequest:subject:Patient',
            'MedicationRequest:requester',
            'MedicationRequest:medication:Medication',
        ],
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        MedicationRequest | Patient | Organization | Practitioner | Medication,
        StringTypeColumnFilterValue[]
    >('MedicationRequest', queryParameters);

    const medicationRequestResponse = mapSuccess(resourceResponse, (bundle) => {
        return {
            medicationRequests: extractBundleResources(bundle).MedicationRequest,
            patients: extractBundleResources(bundle).Patient,
            organizations: extractBundleResources(bundle).Organization,
            practitioners: extractBundleResources(bundle).Practitioner,
            medications: extractBundleResources(bundle).Medication,
        };
    });

    return {
        pagination,
        medicationRequestResponse,
        pagerManager,
        handleTableChange,
    };
}
