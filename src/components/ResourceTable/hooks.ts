import { Provenance, Resource } from 'fhir/r4b';

import { ResourceTableHookProps } from 'src/components/ResourceTable/types';
import { usePagerExtended } from 'src/hooks/pager';

export function useResourceTable<R extends Resource>(props: ResourceTableHookProps<R>) {
    const { resourceType, params = {} } = props;
    const queryParameters = {
        _sort: ['-_lastUpdated', '_id'],
        ...params,
    };

    const {
        resourceResponse: response,
        handleTableChange,
        pagination,
    } = usePagerExtended<R | Provenance>(resourceType, queryParameters);

    return { response, pagination, handleTableChange };
}
