import { Bundle, List, Resource } from 'fhir/r4b';
import { useState } from 'react';

import { SearchParams, extractBundleResources } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarColumnFilterValue } from 'src/components/SearchBar/utils';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';

export function useResourceList<R extends Resource>(
    resourceType: R['resourceType'],
    filterValues: ColumnFilterValue[],
    searchParams: SearchParams,
) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const debouncedFilterValues = useDebounce(filterValues, 300);

    const defaultQueryParameters = {
        _sort: '-_lastUpdated',
        ...Object.fromEntries(
            debouncedFilterValues.map((filterValue) => [
                filterValue.column.id,
                getSearchBarColumnFilterValue(filterValue),
            ]),
        ),
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<R, ColumnFilterValue[]>(
        resourceType,
        { ...searchParams, ...defaultQueryParameters },
    );

    const recordResponse = mapSuccess(resourceResponse, (bundle) =>
        extractBundleResources(bundle)[resourceType].map((resource) => ({
            resource: resource as R,
            bundle: bundle as Bundle,
        })),
    );
    const selectedResourcesList: List = {
        resourceType: 'List',
        status: 'current',
        mode: 'working',
        entry: isSuccess(recordResponse) ? recordResponse.data.map(({ resource }) => ({ item: resource })) : [],
    };

    return {
        pagination,
        recordResponse,
        pagerManager,
        handleTableChange,
        selectedRowKeys,
        setSelectedRowKeys,
        selectedResourcesList,
    };
}
