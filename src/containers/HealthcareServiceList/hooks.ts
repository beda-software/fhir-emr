import { HealthcareService } from 'fhir/r4b';

import { extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarFilterValue } from 'src/components/SearchBar/utils';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';

export function useHealthcareServiceList(filterValues: ColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const healthcareServiceFilterValue = getSearchBarFilterValue(filterValues, 'service');

    const queryParameters = {
        _sort: ['-_lastUpdated', '_id'],
        ilike: healthcareServiceFilterValue,
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        HealthcareService,
        ColumnFilterValue[]
    >('HealthcareService', queryParameters, debouncedFilterValues);

    const healthcareServiceResponse = mapSuccess(
        resourceResponse,
        (bundle) => extractBundleResources(bundle).HealthcareService,
    );

    return {
        pagination,
        healthcareServiceResponse,
        pagerManager,
        handleTableChange,
    };
}
