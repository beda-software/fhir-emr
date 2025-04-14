import { Bundle, Resource } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

import { RecordType } from '../ResourceListPage/types';

export interface Tab<R extends Resource> {
    label: string;
    path?: string;
    component: (context: RecordType<R>) => JSX.Element;
}

export interface DetailPageProps<R extends Resource> {
    resourceType: R['resourceType'];
    getSearchParams: (params: Readonly<Record<string, string | string[] | undefined>>) => SearchParams;
    getTitle: (context: RecordType<R>) => string;
    tabs: Array<Tab<R>>;
    extractPrimaryResource?: (bundle: Bundle<R>) => R;
}

export interface PageTabsProps<R extends Resource> {
    tabs: Array<Tab<R>>;
}
