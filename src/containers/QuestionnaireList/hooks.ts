import { Questionnaire } from 'fhir/r4b';

import { extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarFilterValue } from 'src/components/SearchBar/utils';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';

export function useQuestionnaireList(filterValues: ColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const questionnaireFilterValue = getSearchBarFilterValue(filterValues, 'questionnaire');

    const queryParameters = {
        _sort: ['-_lastUpdated', '_id'],
        name: questionnaireFilterValue,
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Questionnaire,
        ColumnFilterValue[]
    >('Questionnaire', queryParameters, debouncedFilterValues);

    const questionnaireListRD = mapSuccess(resourceResponse, (bundle) => extractBundleResources(bundle).Questionnaire);

    return {
        pagination,
        questionnaireListRD,
        pagerManager,
        handleTableChange,
        questionnaireFilterValue,
    };
}
