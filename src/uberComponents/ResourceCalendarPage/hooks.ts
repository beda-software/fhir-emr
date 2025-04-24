import { Bundle, Resource, Slot } from 'fhir/r4b';
import { useMemo, useState } from 'react';

import { extractBundleResources, SearchParams, usePager } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess, sequenceMap } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarColumnFilterValue } from 'src/components/SearchBar/utils';
import { service } from 'src/services/fhir';
import { useDebounce } from 'src/utils/debounce';

import { ResourceCalendarPageProps } from './types';
import { calculateEvents, calculateSlots, useCalendarEvents, extractPrimaryResourcesFactory } from './utils';

export function useCalendarPage<R extends Resource>(
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

    const defaultPageSize = defaultSearchParams._count;

    const [pageSize, setPageSize] = useState(typeof defaultPageSize === 'number' ? defaultPageSize : 10);

    const [resourceResponse, pagerManager] = usePager<R>({
        resourceType,
        requestService: service,
        resourcesOnPage: pageSize,
        initialSearchParams: searchParams,
    });

    const [slotResourceResponse, slotPagerManager] = usePager<Slot>({
        resourceType: 'Slot',
        requestService: service,
        resourcesOnPage: pageSize,
        initialSearchParams: slot?.searchParams,
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

    const recordResponse = mapSuccess(resourceResponse, (bundle) =>
        calculateEvents(
            extractPrimaryResourcesMemoized(bundle as Bundle).map((resource) => ({
                resource: resource as R,
                bundle: bundle as Bundle,
            })),
            event,
        ),
    );

    const slotRecordResponse = mapSuccess(slotResourceResponse, (bundle) =>
        calculateSlots(
            extractBundleResources(bundle).Slot.map((resource) => ({
                resource: resource as Slot,
                bundle: bundle as Bundle,
            })),
            slot,
        ),
    );

    const eventResponse = useMemo(
        () =>
            sequenceMap({
                recordResponse: recordResponse,
                slotRecordResponse: slotRecordResponse,
            }),
        [recordResponse, slotRecordResponse],
    );

    return {
        eventResponse,
        pagination,
        slotPagination,
        reload,
        eventCreate,
        eventShow,
        eventEdit,
        questionnaireActions,
    };
}
