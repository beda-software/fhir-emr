import { extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { useDebounce } from 'src/utils/debounce';

import { usePagerExtended } from '../EncounterList/hooks';

export function usePatientList(filterValues: StringTypeColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const patientFilterValue = debouncedFilterValues[0];

    const queryParameters = {
        _sort: '-_lastUpdated',
        ...(patientFilterValue ? { name: patientFilterValue.value } : {}),
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } =
        usePagerExtended<Patient, StringTypeColumnFilterValue[]>('Patient', queryParameters, debouncedFilterValues);

    const patientsResponse = mapSuccess(
        resourceResponse,
        (bundle) => extractBundleResources(bundle).Patient,
    );

    return {
        pagination,
        patientsResponse,
        pagerManager,
        handleTableChange,
    };
}
