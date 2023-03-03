import { TablePaginationConfig } from 'antd';
import { useEffect, useState } from 'react';

import { usePager } from 'aidbox-react/lib/hooks/pager';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { SearchParams } from 'aidbox-react/lib/services/search';

import { Resource } from 'shared/src/contrib/aidbox';

export function usePagerExtended<T extends Resource, F = unknown>(
    resourceType: string,
    searchParams?: SearchParams,
    debouncedFilterValues?: F,
) {
    const [pageSize, setPageSize] = useState(10);

    const [resourceResponse, pagerManager] = usePager<T>(resourceType, pageSize, searchParams);

    const handleTableChange = async (pagination: TablePaginationConfig) => {
        if (typeof pagination.current !== 'number') return;

        if (pagination.pageSize && pagination.pageSize !== pageSize) {
            pagerManager.loadPage(pagination.current);
            setPageSize(pagination.pageSize);
        } else {
            pagerManager.loadPage(pagination.current);
        }
    };

    const pagination = {
        current: pagerManager.currentPage,
        pageSize: pageSize,
        total: isSuccess(resourceResponse) ? resourceResponse.data.total : 0,
    };

    useEffect(() => {
        pagerManager.reload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilterValues]);

    return { resourceResponse, pagerManager, handleTableChange, pagination };
}
