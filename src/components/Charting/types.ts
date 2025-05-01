import { Bundle, Resource } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

import { PageContainerProps } from 'src/components';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';

export interface TabExtra {
    chartingContent?: React.ReactNode;
}

export interface ChartingProps<R extends Resource> extends Pick<PageContainerProps, 'maxWidth' | 'layoutVariant'> {
    resourceType: R['resourceType'];
    getSearchParams: (params: Readonly<Record<string, string | string[] | undefined>>) => SearchParams;
    getTitle: (context: RecordType<R>) => string;
    chartingContent: React.ReactNode;
    extractPrimaryResource?: (bundle: Bundle<R>) => R;
    headerContent?: React.ReactNode;
    titleRightElement?: React.ReactNode;
    chartingHeader?: React.ReactNode;
    children?: React.ReactNode;
}
