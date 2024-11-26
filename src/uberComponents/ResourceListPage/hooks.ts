import { Bundle, List, Resource } from 'fhir/r4b';
import { useMemo, useState } from 'react';

import { SearchParams } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarColumnFilterValue } from 'src/components/SearchBar/utils';
import { usePagerExtended } from 'src/hooks/pager';
import { useDebounce } from 'src/utils/debounce';

export function useResourceListPage<R extends Resource>(
    resourceType: R['resourceType'],
    extractPrimaryResources: ((bundle: Bundle) => R[]) | undefined,
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

    const extractPrimaryResourcesMemoized = useMemo(() => {
        return extractPrimaryResources ?? extractPrimaryResourcesFactory(resourceType);
    }, [resourceType, extractPrimaryResources]);

    const recordResponse = mapSuccess(resourceResponse, (bundle) =>
        extractPrimaryResourcesMemoized(bundle as Bundle).map((resource) => ({
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

function extractPrimaryResourcesFactory<R extends Resource>(resourceType: R['resourceType']) {
    return (bundle: Bundle) => {
        return (bundle.entry ?? [])
            .filter((entry) => entry.resource?.resourceType === resourceType)
            .map((entry) => entry.resource as R);
    };
}
