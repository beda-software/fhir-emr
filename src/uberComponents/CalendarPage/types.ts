import { Bundle, Resource } from 'fhir/r4b';

import { WebExtra } from '../ResourceListPage/actions';
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

export type CalendarPageProps<R extends Resource> = ResourceListProps<R, WebExtra> & {
    headerTitle: string;
    eventConfig: (r: Resource, bundle: Bundle) => EventConfig;
    businessHours?: (bundle: Bundle) => BusinessHours;
    maxWidth?: number | string;
};
