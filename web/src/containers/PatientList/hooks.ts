import { TablePaginationConfig } from 'antd';
import { useEffect, useState } from 'react';

import { usePager } from 'aidbox-react/lib/hooks/pager';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { useDebounce } from 'src/utils/debounce';

export function usePatientList(filterValues: StringTypeColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const [pageSize, setPageSize] = useState(10);

    const patientFilterValue = debouncedFilterValues[0];

    const [resourceResponse, pagerManager] = usePager<Patient>('Patient', pageSize, {
        _sort: '-_lastUpdated',
        ...(patientFilterValue ? { name: patientFilterValue.value } : {}),
    });

    const patientsResponse = mapSuccess(
        resourceResponse,
        (bundle) => extractBundleResources(bundle).Patient,
    );

    const pagination = {
        current: pagerManager.currentPage,
        pageSize: pageSize,
        total: isSuccess(resourceResponse) ? resourceResponse.data.total : 0,
    };

    const handleTableChange = async (pagination: TablePaginationConfig) => {
        if (typeof pagination.current !== 'number') return;

        if (pagination.pageSize && pagination.pageSize !== pageSize) {
            pagerManager.loadPage(pagination.current);
            setPageSize(pagination.pageSize);
        } else {
            pagerManager.loadPage(pagination.current);
        }
    };

    useEffect(() => {
        pagerManager.reload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilterValues]);

    return {
        pagination,
        patientsResponse,
        pagerManager,
        handleTableChange,
    };
}
