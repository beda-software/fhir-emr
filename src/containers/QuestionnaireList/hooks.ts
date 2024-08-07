import { Questionnaire } from 'fhir/r4b';

import { extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';

export function useQuestionnaireList(filterValues: StringTypeColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const questionnaireFilterValue = debouncedFilterValues[0];

    const queryParameters = {
        _sort: '-_lastUpdated',
        ...(questionnaireFilterValue ? { name: questionnaireFilterValue.value } : {}),
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Questionnaire,
        StringTypeColumnFilterValue[]
    >('Questionnaire', queryParameters, debouncedFilterValues);

    const questionnaireListRD = mapSuccess(resourceResponse, (bundle) => extractBundleResources(bundle).Questionnaire);

    return { pagination, questionnaireListRD, pagerManager, handleTableChange, queryParameters };
}
