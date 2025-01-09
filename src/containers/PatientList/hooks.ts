import { Consent, Patient } from 'fhir/r4b';

import { SearchParams, extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarFilterValue } from 'src/components/SearchBar/utils';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';

export function usePatientList(filterValues: ColumnFilterValue[], searchParams: SearchParams) {
    const debouncedFilterValues = useDebounce(filterValues, 300);
    // The `isSearchConsent` variable will be set to `true` if `_include: [...]` exists in `searchParams`.
    // In the current implementation, the `include` parameter is used exclusively when retrieving Patients via Consent resources.
    // This behavior is designed to adhere to the practitioner-patient access policy.
    const isSearchConsent = Object.keys(searchParams).includes('_include');
    const patientFilterValue = getSearchBarFilterValue(filterValues, 'patient');
    const searchParamKeyForPatientName = isSearchConsent
        ? { 'patient:Patient.name': patientFilterValue }
        : { name: patientFilterValue };

    const defaultQueryParameters = {
        _sort: ['-_lastUpdated', '_id'],
        ...(patientFilterValue ? searchParamKeyForPatientName : {}),
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        typeof isSearchConsent extends true ? Consent | Patient : Patient,
        ColumnFilterValue[]
    >(isSearchConsent ? 'Consent' : 'Patient', { ...searchParams, ...defaultQueryParameters }, debouncedFilterValues);

    const patientsResponse = mapSuccess(resourceResponse, (bundle) => extractBundleResources(bundle).Patient);

    return {
        pagination,
        patientsResponse,
        pagerManager,
        handleTableChange,
    };
}
