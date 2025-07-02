import { Bundle, Resource } from 'fhir/r4b';

import { SearchParams, WithId } from '@beda.software/fhir-react';

import { RecordType } from '../ResourceListPage/types';

export type Tab<R extends Resource, Extra = unknown> = {
    label: string;
    path?: string;
    component: (context: RecordType<R>) => JSX.Element;
} & Extra;

export interface DetailPageProps<R extends Resource> {
    resourceType: R['resourceType'];
    getSearchParams: (params: Readonly<Record<string, string | string[] | undefined>>) => SearchParams;
    getTitle: (context: RecordType<WithId<R>>) => string;
    tabs: Array<Tab<WithId<R>>>;
    extractPrimaryResource?: (bundle: Bundle<R>) => WithId<R>;
}

export type PageTabsProps<R extends Resource, Extra = unknown> = {
    tabs: Array<Tab<WithId<R>, Extra>>;
};
