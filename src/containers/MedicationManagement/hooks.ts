import { Medication, MedicationKnowledge } from 'fhir/r4b';

import { SearchParams, extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';

export function useMedicationList(searchParameters: SearchParams) {
    const queryParameters = searchParameters ?? {};

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

export function useMedicationKnowledge(code?: string) {
    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        MedicationKnowledge,
        StringTypeColumnFilterValue[]
    >('MedicationKnowledge', { code: code });

    const medicationKnowledgeResponse = mapSuccess(
        resourceResponse,
        (bundle) => extractBundleResources(bundle).MedicationKnowledge,
    );

    return {
        pagination,
        medicationKnowledgeResponse,
        pagerManager,
        handleTableChange,
    };
}
