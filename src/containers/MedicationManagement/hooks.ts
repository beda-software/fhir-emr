import { Medication } from 'fhir/r4b';

import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';

export function useMedicationList() {
    const queryParameters = {};

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Medication,
        StringTypeColumnFilterValue[]
    >('Medication', queryParameters);

    const medicationResponse = mapSuccess(resourceResponse, (bundle) => extractBundleResources(bundle).Medication);

    return {
        pagination,
        medicationResponse,
        pagerManager,
        handleTableChange,
    };
}
