import { Bundle, Resource } from 'fhir/r4b';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { SearchParams, usePager } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarColumnFilterValue } from 'src/components/SearchBar/utils';
import { service } from 'src/services/fhir';
import { useDebounce } from 'src/utils/debounce';

import { RecordType } from './types';

export function useResourceListPage<R extends Resource>(
    resourceType: R['resourceType'],
    extractPrimaryResources: ((bundle: Bundle) => R[]) | undefined,
    extractChildrenResources: ((resource: R, bundle: Bundle) => R[]) | undefined,
    filterValues: ColumnFilterValue[],
    defaultSearchParams: SearchParams,
) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const debouncedFilterValues = useDebounce(filterValues, 300);

    const searchBarSearchParams = {
        ...Object.fromEntries(
            debouncedFilterValues.map((filterValue) => [
                filterValue.column.searchParam ?? filterValue.column.id,
                getSearchBarColumnFilterValue(filterValue),
            ]),
        ),
    };
    const searchParams = { _sort: '-_lastUpdated', ...defaultSearchParams, ...searchBarSearchParams };

    const defaultPageSize = defaultSearchParams._count;

    const [pageSize, setPageSize] = useState(typeof defaultPageSize === 'number' ? defaultPageSize : 10);

    const [resourceResponse, pagerManager] = usePager<R>({
        resourceType,
        requestService: service,
        resourcesOnPage: pageSize,
        initialSearchParams: searchParams,
    });

    const total = isSuccess(resourceResponse) ? resourceResponse.data.total : 0;

    const pagination = useMemo(
        () => ({
            ...pagerManager,
            updatePageSize: (pageSize: number) => {
                pagerManager.reload();
                setPageSize(pageSize);
            },
            pageSize,
            total,
        }),
        [pagerManager, pageSize, total, setPageSize],
    );

    useEffect(() => {
        setSelectedRowKeys([]);
    }, [JSON.stringify(searchParams)]);

    const reload = () => {
        setSelectedRowKeys([]);
        pagerManager.reload();
    };

    const extractPrimaryResourcesMemoized = useMemo(() => {
        return extractPrimaryResources ?? extractPrimaryResourcesFactory(resourceType);
    }, [resourceType, extractPrimaryResources]);

    const makeRecord = useCallback(
        (resource: R, bundle: Bundle): RecordType<R> => {
            const childrenResources = extractChildrenResources
                ? extractChildrenResources(resource, bundle)?.map((subResource) => makeRecord(subResource, bundle))
                : [];

            return {
                resource,
                bundle,
                ...(childrenResources.length ? { children: childrenResources } : {}),
            };
        },
        [extractChildrenResources],
    );

    const recordResponse = mapSuccess(resourceResponse, (bundle) =>
        extractPrimaryResourcesMemoized(bundle as Bundle).map((resource) => makeRecord(resource, bundle as Bundle)),
    );

    const selectedResourcesBundle: Bundle<R> = {
        resourceType: 'Bundle',
        type: 'collection',
        entry: isSuccess(recordResponse)
            ? recordResponse.data
                  .filter(
                      ({ resource }) =>
                          resource.resourceType === resourceType && selectedRowKeys.includes(resource.id!),
                  )
                  .map(({ resource }) => ({ resource: resource as R }))
            : [],
    };

    return {
        pagination,
        recordResponse,
        selectedRowKeys,
        setSelectedRowKeys,
        selectedResourcesBundle,
        reload,
    };
}

function extractPrimaryResourcesFactory<R extends Resource>(resourceType: R['resourceType']) {
    return (bundle: Bundle) => {
        return (bundle.entry ?? [])
            .filter((entry) => entry.resource?.resourceType === resourceType)
            .map((entry) => entry.resource as R);
    };
}
