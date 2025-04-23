import { EventContentArg, CalendarOptions } from '@fullcalendar/core';
import { Bundle, Resource } from 'fhir/r4b';
import React from 'react';

import { WebExtra, QuestionnaireActionType } from '../ResourceListPage/actions';
import { ResourceListBaseProps } from '../ResourceListPage/types';

export type DataFn = {
    id: string;
    title: string;
    start: string;
    end: string;
    status: string;
    classNames: string[];
};

export interface NewEventData {
    start: Date;
    end: Date;
}

export type ResourceCalendarPageProps<R extends Resource> = ResourceListBaseProps<R, WebExtra> & {
    headerTitle: string;
    businessHours?: CalendarOptions['businessHours'];
    event: {
        dataFn: (r: Resource, bundle: Bundle) => DataFn;
        view: (eventContent: EventContentArg) => React.ReactElement;
    };
    calendarEventActions: {
        show: QuestionnaireActionType;
        create: QuestionnaireActionType;
        edit: QuestionnaireActionType;
    };
};
