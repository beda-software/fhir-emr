import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

import { NavigationActionType, CustomActionType, QuestionnaireActionType } from './actions';
import { SearchBarColumn } from '../../components/SearchBar/types';

export type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

export interface ReportColumn {
    title: React.ReactNode;
    value: React.ReactNode;
}

export interface TableManager {
    reload: () => void;
}

export interface ResourceListProps<R extends Resource> {
    /* Primary resource type (for example, Organization) */
    resourceType: R['resourceType'];

    /**
     * Custom primary resources extractor, might be used when the same resource type included
     * e.g. Organizations included via part-of
     *
     * Default - extract all resources matching `resourceType`
     */
    extractPrimaryResources?: (bundle: Bundle) => R[];

    /* Default search params */
    searchParams?: SearchParams;

    /* Filter that are displayed in the search bar and inside table columns */
    getFilters?: () => SearchBarColumn[];

    /**
     * Record actions list that is displayed in the table per record
     * (for example, edit organization)
     */
    getRecordActions?: (
        record: RecordType<R>,
        manager: TableManager,
    ) => Array<QuestionnaireActionType | NavigationActionType | CustomActionType>;

    /**
     * Header actions (for example, new organization)
     *
     * NOTE: Theoretically getHeaderActions can accept all resources Bundle
     */
    getHeaderActions?: () => Array<QuestionnaireActionType>;

    /**
     * Batch actions that are available when rows are selected
     * (for example, delete multiple organizations)
     *
     * NOTE: Theoretically getHeaderActions can accept selected resources Bundle
     */
    getBatchActions?: () => Array<QuestionnaireActionType>;

    /**
     * Default launch context that will be added to all questionnaires
     */
    defaultLaunchContext?: ParametersParameter[];

    /**
     * EXPERIMENTAL FEATURE. The interface might be changed
     * TODO: https://github.com/beda-software/fhir-emr/issues/414
     */
    // loadReportBundle?: (searchParams: SearchParams) => Promise<RemoteDataResult<Bundle>>

    /**
     * EXPERIMENTAL FEATURE. The interface might be changed
     * TODO: https://github.com/beda-software/fhir-emr/issues/414
     */
    getReportColumns?: (bundle: Bundle, reportBundle?: Bundle) => Array<ReportColumn>;
}
