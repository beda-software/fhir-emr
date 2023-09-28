import { Consent, Patient } from 'fhir/r4b';

import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { SearchParams } from 'fhir-react/lib/services/search';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';

export function usePatientList(filterValues: StringTypeColumnFilterValue[], searchParams: SearchParams) {
    const debouncedFilterValues = useDebounce(filterValues, 300);
    // The `isSearchConsent` variable will be set to `true` if `_include: [...]` exists in `searchParams`.
    // In the current implementation, the `include` parameter is used exclusively when retrieving Patients via Consent resources.
    // This behavior is designed to adhere to the practitioner-patient access policy.
    const isSearchConsent = Object.keys(searchParams).includes('_include');
    const patientFilterValue = debouncedFilterValues[0];
    const searchParamKeyForPatientName = isSearchConsent
        ? { 'patient:Patient.name': patientFilterValue?.value }
        : { name: patientFilterValue?.value };

    const defaultQueryParameters = {
        _sort: '-_lastUpdated',
        ...(patientFilterValue ? searchParamKeyForPatientName : {}),
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        typeof isSearchConsent extends true ? Consent | Patient : Patient,
        StringTypeColumnFilterValue[]
    >(isSearchConsent ? 'Consent' : 'Patient', { ...searchParams, ...defaultQueryParameters }, debouncedFilterValues);

    const patientsResponse = mapSuccess(resourceResponse, (bundle) => extractBundleResources(bundle).Patient);

    return {
        pagination,
        patientsResponse,
        pagerManager,
        handleTableChange,
    };
}
