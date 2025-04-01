import { TablePaginationConfig } from 'antd';
import { Resource } from 'fhir/r4b';
import { useState } from 'react';

import { SearchParams, usePager } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { service } from 'src/services/fhir';

export function usePagerExtended<T extends Resource, F = unknown>(
    resourceType: string,
    searchParams?: SearchParams,
    debouncedFilterValues?: F,
    defaultPageSize?: number,
    initialPage?: number,
) {
    const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);

    const [resourceResponse, pagerManager] = usePager<T>({
        resourceType,
        requestService: service,
        resourcesOnPage: pageSize,
        initialSearchParams: searchParams,
        initialPage,
    });

    const handleTableChange = async (pagination: TablePaginationConfig) => {
        if (typeof pagination.current !== 'number') return;

        if (pagination.pageSize && pagination.pageSize !== pageSize) {
            pagerManager.reload();
            setPageSize(pagination.pageSize);
        } else {
            pagerManager.loadPage(pagination.current, {
                _page: pagination.current,
            });
        }
    };

    const pagination = {
        current: pagerManager.currentPage,
        pageSize: pageSize,
        total: isSuccess(resourceResponse) ? resourceResponse.data.total : 0,
    };

    return { resourceResponse, pagerManager, handleTableChange, pagination };
}
