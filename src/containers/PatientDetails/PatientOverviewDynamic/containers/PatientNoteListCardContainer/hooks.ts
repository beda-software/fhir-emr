import { Observation } from 'fhir/r4b';

import { extractBundleResources, SearchParams } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { usePagerExtended } from 'src/hooks/pager';

export function useNoteListDashboard(searchParams: SearchParams) {
    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<Observation>(
        'Observation',
        searchParams,
    );

    const noteListRemoteData = mapSuccess(resourceResponse, (bundle) => {
        const resources = extractBundleResources(bundle);
        return { notes: resources.Observation };
    });

    return {
        noteListRemoteData,
        pagination,
        paginationChange: handleTableChange,
        reloadNoteList: pagerManager.reload,
    };
}
