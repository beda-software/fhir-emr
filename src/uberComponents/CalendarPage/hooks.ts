import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Bundle, Resource } from 'fhir/r4b';
import { useMemo, useState, useCallback } from 'react';

import { SearchParams, usePager } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarColumnFilterValue } from 'src/components/SearchBar/utils';
import { service } from 'src/services/fhir';
import { useDebounce } from 'src/utils/debounce';

import { NewEventData, CalendarPageProps } from './types';

export function useCalendarEvents<R extends Resource>(
    calendarEventActions: CalendarPageProps<R>['calendarEventActions'],
) {
    const { create, show } = calendarEventActions;

    const [newEventData, setNewEventData] = useState<NewEventData | undefined>();
    const [eventDetails, setEventDetails] = useState<EventClickArg['event'] | undefined>();
    const [editingEventId, setEditingEventId] = useState<string | undefined>();

    const openNewEventModal = useCallback(({ start, end }: DateSelectArg) => {
        setNewEventData({
            start,
            end,
        });
    }, []);
    const closeNewEventModal = useCallback(() => {
        setNewEventData(undefined);
    }, []);

    const openEventDetails = useCallback((e: EventClickArg) => {
        setEventDetails(e.event);
    }, []);
    const closeEventDetails = useCallback(() => {
        setEventDetails(undefined);
    }, []);

    const openEditEvent = useCallback((id: string) => {
        setEditingEventId(id);
    }, []);
    const closeEditEvent = useCallback(() => {
        setEditingEventId(undefined);
    }, []);

    const isEventDetailsModalOpen = Boolean(eventDetails);
    const isEventCreateModalOpen = Boolean(newEventData);

    const updatedCalendarEventDetails = {
        ...show,
        ...{
            extra: {
                modalProps: {
                    title: show.title,
                    open: isEventDetailsModalOpen,
                    onCancel: closeEventDetails,
                },
                qrfProps: {
                    readOnly: true,
                },
            },
        },
    };

    const updatedCalendarEventCreate = {
        ...create,
        ...{
            extra: {
                modalProps: {
                    title: create.title,
                    open: isEventCreateModalOpen,
                    onCancel: closeNewEventModal,
                },
            },
        },
    };

    const emptyBusinessHours = [
        {
            daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
            startTime: '08:00',
            endTime: '08:00',
        },
    ];

    return {
        eventCreate: {
            modalOpen: openNewEventModal,
            modalClose: closeNewEventModal,
            show: isEventCreateModalOpen,
            data: newEventData,
        },
        eventShow: {
            modalOpen: openEventDetails,
            modalClose: closeEventDetails,
            show: isEventDetailsModalOpen,
            data: eventDetails,
        },
        eventEdit: {
            modalOpen: openEditEvent,
            modalClose: closeEditEvent,
            data: editingEventId,
        },
        questionnaireActions: {
            show: updatedCalendarEventDetails,
            create: updatedCalendarEventCreate,
        },
        emptyBusinessHours,
    };
}

export function useCalendarPage<R extends Resource>(
    resourceType: R['resourceType'],
    extractPrimaryResources: ((bundle: Bundle) => R[]) | undefined,
    filterValues: ColumnFilterValue[],
    defaultSearchParams: SearchParams,
) {
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

    const reload = () => {
        pagerManager.reload();
    };

    const extractPrimaryResourcesMemoized = useMemo(() => {
        return extractPrimaryResources ?? extractPrimaryResourcesFactory(resourceType);
    }, [resourceType, extractPrimaryResources]);

    const recordResponse = mapSuccess(resourceResponse, (bundle) =>
        extractPrimaryResourcesMemoized(bundle as Bundle).map((resource) => ({
            resource: resource as R,
            bundle: bundle as Bundle,
        })),
    );

    return {
        pagination,
        recordResponse,
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
