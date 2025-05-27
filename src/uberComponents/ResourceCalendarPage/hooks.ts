import { Bundle, Resource, Slot } from 'fhir/r4b';
import { useMemo, useState } from 'react';

import { extractBundleResources, SearchParams, usePager, WithId, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess, sequenceMap } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarColumnFilterValue } from 'src/components/SearchBar/utils';
import { service } from 'src/services/fhir';
import { useDebounce } from 'src/utils/debounce';

import { ResourceCalendarPageProps } from './types';
import {
    calculateEvents,
    calculateSlots,
    useCalendarEvents,
    extractPrimaryResourcesFactory,
    slotSearchParamsMapping,
} from './utils';
import { ResourceContext } from '../types';

export function useCalendarPage<R extends WithId<Resource>>(
    resourceType: R['resourceType'],
    extractPrimaryResources: ((bundle: Bundle) => R[]) | undefined,
    filterValues: ColumnFilterValue[],
    defaultSearchParams: SearchParams,
    event: ResourceCalendarPageProps<R>['event'],
    slot: ResourceCalendarPageProps<R>['slot'],
) {
    const { eventCreate, eventShow, eventEdit, questionnaireActions } = useCalendarEvents<R>(event.actions);
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
    const slotSearchParams = slotSearchParamsMapping(searchBarSearchParams ?? {}, slot?.searchParamsMapping);

    const [slotResourceResponse, slotPagerManager] = useService(
        async () =>
            service<Bundle<WithId<Slot>>>({
                method: 'GET',
                url: slot?.operationUrl ?? '/Slot',
                params: slotSearchParams,
            }),
        [JSON.stringify(slotSearchParams)],
    );

    const defaultPageSize = defaultSearchParams._count;

    const [pageSize, setPageSize] = useState(typeof defaultPageSize === 'number' ? defaultPageSize : 10);

    const [resourceResponse, pagerManager] = usePager<R>({
        resourceType,
        requestService: service,
        resourcesOnPage: pageSize,
        initialSearchParams: searchParams,
    });

    const total = isSuccess(resourceResponse) ? resourceResponse.data.total : 0;
    const slotTotal = isSuccess(slotResourceResponse) ? slotResourceResponse.data.total : 0;

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

    const slotPagination = useMemo(
        () => ({
            ...slotPagerManager,
            updatePageSize: (pageSize: number) => {
                slotPagerManager.reload();
                setPageSize(pageSize);
            },
            pageSize,
            slotTotal,
        }),
        [slotPagerManager, pageSize, slotTotal, setPageSize],
    );

    const reload = () => {
        pagerManager.reload();
        slotPagerManager.reload();
    };

    const extractPrimaryResourcesMemoized = useMemo(() => {
        return extractPrimaryResources ?? extractPrimaryResourcesFactory(resourceType);
    }, [resourceType, extractPrimaryResources]);

    function resourceToCTX<R extends WithId<Resource>>(resource: R, bundle: Bundle<R>): ResourceContext<R> {
        const resourceData = resource as R;
        const bundleData = bundle as Bundle;
        return {
            resource: resourceData,
            bundle: bundleData,
        };
    }

    const recordResponse = mapSuccess(resourceResponse, (bundle) => {
        const extractedPrimaryResources = extractPrimaryResourcesMemoized(bundle as Bundle);
        const contexts = extractedPrimaryResources.map((resource) => resourceToCTX<R>(resource, bundle));

        return calculateEvents(contexts, event);
    });

    const slotRecordResponse = mapSuccess(slotResourceResponse, (bundle) => {
        const extractedPrimaryResources = extractBundleResources(bundle).Slot;
        const contexts = extractedPrimaryResources.map((resource) => resourceToCTX<WithId<Slot>>(resource, bundle));

        return calculateSlots(contexts, slot);
    });

    const eventResponse = useMemo(
        () =>
            sequenceMap({
                recordResponse: recordResponse,
                slotRecordResponse: slotRecordResponse,
            }),
        [recordResponse, slotRecordResponse],
    );

    const resourceToShowOrEdit = useMemo(() => {
        return eventShow.data?.extendedProps?.fullResource || eventEdit.data;
    }, [eventShow, eventEdit]);

    const defaultEventQuetionnaireActionProps = useMemo(() => {
        return {
            reload: reload,
            defaultLaunchContext: [],
            resource: resourceToShowOrEdit ? (resourceToShowOrEdit as R) : ({ resourceType: 'Appointment' } as R),
        };
    }, [resourceToShowOrEdit]);

    return {
        eventResponse,
        pagination,
        slotPagination,
        reload,
        eventCreate,
        eventShow,
        eventEdit,
        questionnaireActions,
        defaultEventQuetionnaireActionProps,
    };
}
