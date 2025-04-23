import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Bundle, Resource } from 'fhir/r4b';
import { useMemo, useState, useCallback } from 'react';

import { SearchParams, usePager } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarColumnFilterValue } from 'src/components/SearchBar/utils';
import { service } from 'src/services/fhir';
import { useDebounce } from 'src/utils/debounce';

import { NewEventData, ResourceCalendarPageProps } from './types';

function extractPrimaryResourcesFactory<R extends Resource>(resourceType: R['resourceType']) {
    return (bundle: Bundle) => {
        return (bundle.entry ?? [])
            .filter((entry) => entry.resource?.resourceType === resourceType)
            .map((entry) => entry.resource as R);
    };
}

function useModal<T = undefined>() {
    const [data, setData] = useState<T | undefined>();

    const open = useCallback((value: T) => setData(value), []);
    const close = useCallback(() => setData(undefined), []);

    return {
        data,
        isOpen: Boolean(data),
        open,
        close,
    };
}

export function useCalendarEvents<R extends Resource>(
    calendarEventActions: ResourceCalendarPageProps<R>['calendarEventActions'],
) {
    const { create, show, edit } = calendarEventActions;
    const newEventModal = useModal<NewEventData>();
    const eventDetailsModal = useModal<EventClickArg['event']>();
    const editEventModal = useModal<string>();

    const updatedCalendarEventDetails = useMemo(
        () => ({
            ...show,
            extra: {
                modalProps: {
                    title: show.title,
                    open: eventDetailsModal.isOpen,
                    onCancel: eventDetailsModal.close,
                },
                qrfProps: {
                    readOnly: true,
                },
            },
        }),
        [show, eventDetailsModal.isOpen, eventDetailsModal.close],
    );

    const updatedCalendarEventCreate = useMemo(
        () => ({
            ...create,
            extra: {
                modalProps: {
                    title: create.title,
                    open: newEventModal.isOpen,
                    onCancel: newEventModal.close,
                },
            },
        }),
        [create, newEventModal.isOpen, newEventModal.close],
    );

    const updatedCalendarEventEdit = useMemo(
        () => ({
            ...edit,
            extra: {
                modalProps: {
                    title: edit.title,
                    open: editEventModal.isOpen,
                    onCancel: editEventModal.close,
                },
            },
        }),
        [edit, editEventModal.isOpen, editEventModal.close],
    );

    return {
        eventCreate: {
            modalOpen: (args: DateSelectArg) => newEventModal.open({ start: args.start, end: args.end }),
            modalClose: newEventModal.close,
            show: newEventModal.isOpen,
            data: newEventModal.data,
        },
        eventShow: {
            modalOpen: (e: EventClickArg) => eventDetailsModal.open(e.event),
            modalClose: eventDetailsModal.close,
            show: eventDetailsModal.isOpen,
            data: eventDetailsModal.data,
        },
        eventEdit: {
            modalOpen: (id: string) => editEventModal.open(id),
            modalClose: editEventModal.close,
            show: editEventModal.isOpen,
            data: editEventModal.data,
        },
        questionnaireActions: {
            show: updatedCalendarEventDetails,
            create: updatedCalendarEventCreate,
            edit: updatedCalendarEventEdit,
        },
    };
}

export function useCalendarPage<R extends Resource>(
    resourceType: R['resourceType'],
    extractPrimaryResources: ((bundle: Bundle) => R[]) | undefined,
    filterValues: ColumnFilterValue[],
    defaultSearchParams: SearchParams,
    calendarEventActions: ResourceCalendarPageProps<R>['calendarEventActions'],
) {
    const { eventCreate, eventShow, eventEdit, questionnaireActions } = useCalendarEvents<R>(calendarEventActions);
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
        eventCreate,
        eventShow,
        eventEdit,
        questionnaireActions,
    };
}
