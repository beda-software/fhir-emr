import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Button } from 'antd';
import { Bundle, Resource, Slot } from 'fhir/r4b';
import React, { useMemo, useState, useCallback } from 'react';

import { SearchParams } from '@beda.software/fhir-react';

import { NewEventData, ResourceCalendarPageProps, EventColorMapping, SlotSearchParamsMapping } from './types';
import { ResourceContext } from '../types';

export function slotSearchParamsMapping(searchParams: SearchParams, mapping?: SlotSearchParamsMapping): SearchParams {
    if (mapping === undefined) {
        return {};
    }

    const result = Object.fromEntries(
        Object.entries(mapping).map(([mappingKey, actualKey]) => [actualKey, searchParams[mappingKey]]),
    );

    return result ?? {};
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
