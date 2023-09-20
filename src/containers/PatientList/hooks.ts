import { Consent, Patient } from 'fhir/r4b';

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
        status: 'active',
        actor: practitionerId,
        category: 'data-sharing',
        period: formatFHIRDate(new Date()),
        _include: ['patient'],
        _sort: '-_lastUpdated',
        // ...(patientFilterValue ? { name: patientFilterValue.value } : {}), TODO: Fix search by name
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Consent | Patient,
        StringTypeColumnFilterValue[]
    >('Consent', queryParameters, debouncedFilterValues);

    const patientsResponse = mapSuccess(resourceResponse, (bundle) => extractBundleResources(bundle).Patient);

    return {
        pagination,
        patientsResponse,
        pagerManager,
        handleTableChange,
    };
}
