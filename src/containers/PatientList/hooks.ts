import { Patient } from 'fhir/r4b';

import { formatFHIRDate } from 'aidbox-react/lib/utils/date';

import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';
import { Role, matchCurrentUserRole } from 'src/utils/role';

export function usePatientList(filterValues: StringTypeColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const patientFilterValue = debouncedFilterValues[0];

    const defaultQueryParameters = {
        _sort: '-_lastUpdated',
        ...(patientFilterValue ? { name: patientFilterValue.value } : {}),
    };

    const queryParameters = matchCurrentUserRole({
        [Role.Admin]: () => defaultQueryParameters,
        [Role.Practitioner]: (practitioner) => {
            return {
                '_has:Consent:patient:status': 'active',
                '_has:Consent:patient:category': 'data-sharing',
                '_has:Consent:patient:period': formatFHIRDate(new Date()),
                '_has:Consent:patient:actor': practitioner.id,
                ...defaultQueryParameters,
            };
        },
        [Role.Patient]: () => {
            // NOTE: In general, patients will never get access to this patient list. But this implementation looks strange. Please discuss it with the team.
            return {};
        },
    });

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
