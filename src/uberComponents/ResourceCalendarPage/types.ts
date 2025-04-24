import { CalendarOptions } from '@fullcalendar/core';
import { Resource, Slot } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

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
        data: {
            startExpression: (r: R) => string | undefined;
            endExpression: (r: R) => string | undefined;
            titleExpression: (r: R) => string | undefined;
        };
        eventColorMapping?: {
            targetExpression: (r: R) => string | undefined;
            colorMapping: Record<string, string>;
        };
        actions: {
            show: QuestionnaireActionType;
            create: QuestionnaireActionType;
            edit: QuestionnaireActionType;
        };
    };
    slot?: {
        searchParams: SearchParams;
        eventColorMapping?: {
            targetExpression: (r: Slot) => string | undefined;
            colorMapping: Record<string, string>;
        };
    };
    businessHours?: CalendarOptions['businessHours'];
};
