import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { useDebounce } from 'src/utils/debounce';

export function usePatientList(filterValues: StringTypeColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const [patientsResponse, patientsResponseManager] = useService(async () => {
        const patientFilterValue = debouncedFilterValues[0];

        return mapSuccess(
            await getFHIRResources<Patient>('Patient', {
                ...(patientFilterValue ? { name: patientFilterValue.value } : {}),
            }),
            (bundle) => extractBundleResources(bundle).Patient,
        );
    }, [debouncedFilterValues]);

    return { patientsResponse, patientsResponseManager };
}
