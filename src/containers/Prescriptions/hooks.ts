import { Medication, MedicationRequest, Organization, Patient, Practitioner } from 'fhir/r4b';

import { extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

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
        _sort: ['-_createdAt', '_id'],
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
