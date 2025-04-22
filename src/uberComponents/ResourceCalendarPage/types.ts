import { EventContentArg } from '@fullcalendar/core';
import { Bundle, Resource } from 'fhir/r4b';
import React from 'react';

import { WebExtra, QuestionnaireActionType } from '../ResourceListPage/actions';
import { ResourceListProps } from '../ResourceListPage/types';

export type EventConfig = {
    id: string;
    title: string;
    start: string;
    end: string;
    status: string;
    classNames: string[];
};

export type BusinessHours = Array<
    | {
          daysOfWeek: number[] | undefined;
          startTime: string | undefined;
          endTime: string | undefined;
      }
    | undefined
>;

export interface NewEventData {
    start: Date;
    end: Date;
}

export type ResourceCalendarPageProps<R extends Resource> = ResourceListProps<R, WebExtra> & {
    headerTitle: string;
    eventConfig: (r: Resource, bundle: Bundle) => EventConfig;
    eventContent?: (eventContent: EventContentArg) => React.ReactElement | null;
    businessHours?: (bundle: Bundle) => BusinessHours;
    calendarEventActions: {
        show: QuestionnaireActionType;
        create: QuestionnaireActionType;
        edit: QuestionnaireActionType;
    };
};
