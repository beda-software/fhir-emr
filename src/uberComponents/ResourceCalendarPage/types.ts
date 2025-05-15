import { CalendarOptions } from '@fullcalendar/core';
import { Resource, Slot } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

import { WebExtra, QuestionnaireActionType } from '../ResourceListPage/actions';
import { ResourceListBaseProps } from '../ResourceListPage/types';

export interface NewEventData {
    start: Date;
    end: Date;
}

type ResourceColorMapping<R extends Resource> = {
    targetExpression: (r: R) => string | undefined;
    colorMapping: Record<string, string>;
};

type TypedFHIRPathExpression<R extends Resource> = (r: R) => string | undefined;

export type EventColorMapping<R extends Resource> = ResourceColorMapping<R> | undefined;

export type ResourceCalendarPageProps<R extends Resource> = ResourceListBaseProps<R, WebExtra> & {
    headerTitle: string;
    event: {
        data: {
            startExpression: TypedFHIRPathExpression<R>;
            endExpression: TypedFHIRPathExpression<R>;
            titleExpression: TypedFHIRPathExpression<R>;
        };
        eventColorMapping?: ResourceColorMapping<R>;
        actions: {
            show: QuestionnaireActionType;
            create: QuestionnaireActionType;
            edit: QuestionnaireActionType;
        };
    };
    slot?: {
        searchParams: SearchParams;
        eventColorMapping?: ResourceColorMapping<Slot>;
    };
    businessHours?: CalendarOptions['businessHours'];
};
