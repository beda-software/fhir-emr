import { DateSelectArg, EventClickArg, CalendarOptions } from '@fullcalendar/core';
import { Resource, Slot } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

import { ColumnFilterValue } from 'src/components/SearchBar/types';

import { WebExtra, QuestionnaireActionType } from '../ResourceListPage/actions';
import { ResourceListBaseProps } from '../ResourceListPage/types';
import { TypedFHIRPathExpression } from '../types';

export interface NewEventData {
    start: Date;
    end: Date;
    searchParams: SearchParams;
}

type ResourceColorMapping<R extends Resource> = {
    // TODO: Fix targetExpression
    targetExpression: (r: R) => string | undefined;
    colorMapping: Record<string, string>;
};

export type EventColorMapping<R extends Resource> = ResourceColorMapping<R> | undefined;

export type SearchParamsMappingType = Record<string, string>;

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
        searchParamsMapping?: SearchParamsMappingType;
    };
    slot?: {
        operationUrl?: string;
        searchParamsMapping?: SearchParamsMappingType;
        eventColorMapping?: ResourceColorMapping<Slot>;
    };
    calendarOptions?: CalendarOptions;
    setSelectedFilterValues?: (val: ColumnFilterValue[] | undefined) => void;
};

export type EventCreateType = {
    modalOpen: (args: DateSelectArg) => void;
    modalClose: () => void;
    show: boolean;
    data: NewEventData | undefined;
};

export type EventShowType = {
    modalOpen: (e: EventClickArg) => void;
    modalClose: () => void;
    show: boolean;
    data: EventClickArg['event'] | undefined;
};

export type EventEditType = {
    modalOpen: (id: string) => void;
    modalClose: () => void;
    show: boolean;
    data: string | undefined;
};
