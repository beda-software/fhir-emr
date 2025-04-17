import { Bundle, Resource } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

import { RecordType } from '../ResourceListPage/types';
import { PageContainerProps } from 'src/components';

export interface Tab<R extends Resource> {
    label: string;
    path: string;
    component: (context: RecordType<R>) => JSX.Element;
    splitterContent?: React.ReactNode;
}

export interface ResourceChartingPageProps<R extends Resource>
    extends Pick<PageContainerProps, 'maxWidth' | 'layoutVariant'> {
    resourceType: R['resourceType'];
    getSearchParams: (params: Readonly<Record<string, string | string[] | undefined>>) => SearchParams;
    getTitle: (context: RecordType<R>) => string;
    tabs: Array<Tab<R>>;
    extractPrimaryResource?: (bundle: Bundle<R>) => R;
    headerContent?: React.ReactNode;
    titleRightElement?: React.ReactNode;
    splitterHeader?: React.ReactNode;
    children?: React.ReactNode;
}

export interface PageTabsProps<R extends Resource> {
    tabs: Array<Tab<R>>;
}
