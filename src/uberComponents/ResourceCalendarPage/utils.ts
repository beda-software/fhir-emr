import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Button } from 'antd';
import { Bundle, Resource, Slot } from 'fhir/r4b';
import React, { useMemo, useState, useCallback } from 'react';

import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';

import { extractBundleResources, SearchParams, WithId, formatFHIRDate } from '@beda.software/fhir-react';
import { mapSuccess, sequenceMap, RemoteData } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarColumnFilterValue } from 'src/components/SearchBar/utils';

import {
    NewEventData,
    ResourceCalendarPageProps,
    EventColorMapping,
    SearchParamsMappingType,
    EventCreateType,
    EventShowType,
    EventEditType,
} from './types';
import { ResourceContext } from '../types';

export function resourceToCTX<R extends WithId<Resource>>(resource: R, bundle: Bundle<R>): ResourceContext<R> {
    const resourceData = resource as R;
    const bundleData = bundle as Bundle;
    return {
        resource: resourceData,
        bundle: bundleData,
    };
}

export function searchParamsMapping(searchParams: SearchParams, mapping?: SearchParamsMappingType): SearchParams {
    if (!mapping) {
        return {};
    }

    const result: Record<string, string> = {};

    for (const [mappingKey, actualKey] of Object.entries(mapping)) {
        const value = searchParams[mappingKey];

        if (value === undefined) continue;

        const newValue = Array.isArray(value) ? value.map((v) => v.toString()).join(',') : value.toString();

        if (result[actualKey] !== undefined) {
            result[actualKey] += `,${newValue}`;
        } else {
            result[actualKey] = newValue;
        }
    }

    return result;
}

function getBackgroundColor<R extends Resource>(
    resource: R,
    eventColorMapping: EventColorMapping<R>,
): string | undefined {
    if (!eventColorMapping) return undefined;

    const { targetExpression, colorMapping } = eventColorMapping;
    const targetValue = targetExpression(resource);

    return targetValue ? colorMapping[targetValue] : undefined;
}

export function calculateEvents<R extends Resource>(
    data: ResourceContext<R>[],
    event: ResourceCalendarPageProps<R>['event'],
) {
    const { eventColorMapping } = event;
    const { titleExpression, startExpression, endExpression } = event.data;

    return data.map((ctx) => ({
        id: ctx.resource.id,
        title: titleExpression(ctx),
        start: startExpression(ctx),
        end: endExpression(ctx),
        fullResource: ctx.resource,
        eventStart: startExpression(ctx),
        eventEnd: endExpression(ctx),
        backgroundColor: getBackgroundColor<R>(ctx.resource, eventColorMapping),
    }));
}

export function calculateSlots<R extends Resource>(
    data: ResourceContext<Slot>[],
    slot: ResourceCalendarPageProps<R>['slot'],
) {
    if (!slot) return undefined;

    const { eventColorMapping } = slot;

    return data.map((ctx) => ({
        id: ctx.resource.id,
        start: ctx.resource.start,
        end: ctx.resource.end,
        display: 'background',
        fullResource: ctx.resource,
        backgroundColor: getBackgroundColor<Slot>(ctx.resource, eventColorMapping),
    }));
}

export function extractPrimaryResourcesFactory<R extends Resource>(resourceType: R['resourceType']) {
    return (bundle: Bundle) => {
        return (bundle.entry ?? [])
            .filter((entry) => entry.resource?.resourceType === resourceType)
            .map((entry) => entry.resource as R);
    };
}

export function useModal<T = undefined>() {
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
    calendarEventActions: ResourceCalendarPageProps<R>['event']['actions'],
    searchParams: SearchParams,
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
                    footer: [
                        React.createElement(
                            Button,
                            {
                                key: 'edit',
                                type: 'primary',
                                onClick: () => {
                                    editEventModal.open(eventDetailsModal?.data?.extendedProps?.fullResource);
                                    eventDetailsModal.close();
                                },
                            },
                            'Edit',
                        ),
                    ],
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
            modalOpen: (args: DateSelectArg) =>
                newEventModal.open({ start: args.start, end: args.end, searchParams: searchParams }),
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

export const defaultSelectedDates = {
    calendarStart: formatFHIRDate(new Date()),
    calendarEnd: formatFHIRDate(new Date()),
};

export function calculateSearchParams(
    filterValues: ColumnFilterValue[],
    defaultSearchParams: SearchParams,
    selectedDates: SearchParams,
    eventMapping: SearchParamsMappingType,
    slotMapping: SearchParamsMappingType,
) {
    const searchBarSearchParams = {
        ...Object.fromEntries(
            filterValues.map((filterValue) => [
                filterValue.column.searchParam ?? filterValue.column.id,
                getSearchBarColumnFilterValue(filterValue),
            ]),
        ),
    };
    const overallSearchParams = {
        ...searchBarSearchParams,
        ...defaultSearchParams,
        ...selectedDates,
    };

    return {
        eventSearchParams: searchParamsMapping(overallSearchParams, eventMapping),
        slotSearchParams: searchParamsMapping(overallSearchParams, slotMapping),
    };
}

export function prepareResourceToShowOrEdit(
    eventShow: EventShowType,
    eventCreate: EventCreateType,
    eventEdit: EventEditType,
) {
    if (eventCreate.data) {
        const searchParams = eventCreate.data.searchParams;
        const extensions = Object.keys(searchParams).flatMap((spKey) => {
            const value = searchParams[spKey];
            if (value === undefined) {
                return [];
            } else {
                return [
                    {
                        url: `ext:${spKey}`,
                        valueString: value[0],
                    },
                ];
            }
        });

        const appointmentData = {
            resourceType: 'Appointment',
            start: formatFHIRDateTime(eventCreate.data.start),
            extension: extensions,
        };

        return appointmentData;
    }

    return eventShow.data?.extendedProps?.fullResource || eventEdit.data;
}

export function defaultEventQuestionnaireProps<R extends Resource>(reload: () => void, resourceToShowOrEdit: any) {
    return {
        reload: reload,
        defaultLaunchContext: [],
        resource: resourceToShowOrEdit ? (resourceToShowOrEdit as R) : ({ resourceType: 'Appointment' } as R),
    };
}

export function prepareEvents<R extends WithId<Resource>>(
    resourceResponse: RemoteData<Bundle<WithId<R>>, any>,
    slotResourceResponse: RemoteData<Bundle<WithId<Slot>>, any>,
    extractPrimaryResources: (bundle: Bundle) => R[],
    event: ResourceCalendarPageProps<R>['event'],
    slot: ResourceCalendarPageProps<R>['slot'],
) {
    return sequenceMap({
        recordResponse: mapSuccess(resourceResponse, (bundle) => {
            const extractedPrimaryResources = extractPrimaryResources(bundle as Bundle);
            const contexts = extractedPrimaryResources.map((resource) => resourceToCTX<R>(resource, bundle));

            return calculateEvents(contexts, event);
        }),
        slotRecordResponse: mapSuccess(slotResourceResponse, (bundle) => {
            const extractedPrimaryResources = extractBundleResources(bundle).Slot;
            const contexts = extractedPrimaryResources.map((resource) => resourceToCTX<WithId<Slot>>(resource, bundle));

            return calculateSlots(contexts, slot);
        }),
    });
}
