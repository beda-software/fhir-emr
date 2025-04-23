import { CalendarOptions } from '@fullcalendar/core';
import { Resource } from 'fhir/r4b';

import { WebExtra, QuestionnaireActionType } from '../ResourceListPage/actions';
import { ResourceListBaseProps } from '../ResourceListPage/types';

export interface NewEventData {
    start: Date;
    end: Date;
}

export type ResourceCalendarPageProps<R extends Resource> = ResourceListBaseProps<R, WebExtra> & {
    headerTitle: string;
    event: {
        startExpression: string;
        endExpression: string;
        titleExpression: string;
    };
    calendarEventActions: {
        show: QuestionnaireActionType;
        create: QuestionnaireActionType;
        edit: QuestionnaireActionType;
    };
    businessHours?: CalendarOptions['businessHours'];
};
