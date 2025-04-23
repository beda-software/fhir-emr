import { CalendarOptions } from '@fullcalendar/core';
import { Resource } from 'fhir/r4b';

import { WebExtra, QuestionnaireActionType } from '../ResourceListPage/actions';
import { ResourceListBaseProps } from '../ResourceListPage/types';

export enum EventColor {
    Default = '#3366FF',
    ServiceCyan = '#13C2C2',
    ServiceOrange = '#FAAD14',
    ServiceMagenta = '#EB2F96',
    ServicePurple = '#722ED1',
    ServiceGreen = '#73D13D',
}

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
        eventColorMapping?: {
            targetExpression: string;
            colorMapping: Record<string, string>;
        };
    };
    calendarEventActions: {
        show: QuestionnaireActionType;
        create: QuestionnaireActionType;
        edit: QuestionnaireActionType;
    };
    businessHours?: CalendarOptions['businessHours'];
};
