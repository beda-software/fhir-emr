import { Patient } from 'fhir/r4b';

import { formatFHIRDate } from 'aidbox-react/lib/utils/date';

import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';

export function usePatientList(filterValues: StringTypeColumnFilterValue[], practitionerId: string) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const patientFilterValue = debouncedFilterValues[0];

    const queryParameters = {
        '_has:Consent:patient:status': 'active',
        '_has:Consent:patient:category': 'data-sharing',
        '_has:Consent:patient:period': formatFHIRDate(new Date()),
        '_has:Consent:patient:actor': practitionerId,
        _sort: '-_lastUpdated',
        ...(patientFilterValue ? { name: patientFilterValue.value } : {}),
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Patient,
        StringTypeColumnFilterValue[]
    >('Patient', queryParameters, debouncedFilterValues);

    const patientsResponse = mapSuccess(resourceResponse, (bundle) => extractBundleResources(bundle).Patient);

    return {
        pagination,
        patientsResponse,
        pagerManager,
        handleTableChange,
    };
}
