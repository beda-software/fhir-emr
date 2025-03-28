import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

import { SearchBarColumn } from '../../components/SearchBar/types';

export type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

export interface ReportColumn {
    title: React.ReactNode;
    value: React.ReactNode;
}

export interface TableManager {
    reload: () => void;
}

// Extra is a platform specific option
// For web it could be specific modal property
export interface ResourceListProps<R extends Resource, Extra = unknown, Link = string> {
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
    ) => Array<QuestionnaireActionType<Extra> | NavigationActionType<Link> | CustomActionType>;

    /**
     * Header actions (for example, new organization)
     *
     * NOTE: Theoretically getHeaderActions can accept all resources Bundle
     */
    getHeaderActions?: () => Array<QuestionnaireActionType<Extra>>;

    /**
     * Batch actions that are available when rows are selected
     * (for example, delete multiple organizations)
     *
     * NOTE: Theoretically getHeaderActions can accept selected resources Bundle
     */
    getBatchActions?: () => Array<QuestionnaireActionType<Extra>>;

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

export interface NavigationActionType<Link = string> {
    type: 'navigation';
    title: React.ReactNode;
    link: Link;
    icon?: React.ReactNode;
}

export interface CustomActionType {
    type: 'custom';
    control: React.ReactNode;
}

export interface QuestionnaireActionType<Extra = unknown> {
    type: 'questionnaire';
    title: React.ReactNode;
    questionnaireId: string;
    icon?: React.ReactNode;
    extra?: Extra;
}

export function navigationAction<Link = string>(
    title: React.ReactNode,
    link: Link,
    options?: { icon?: React.ReactNode },
): NavigationActionType<Link> {
    return { type: 'navigation', title, link, icon: options?.icon };
}
export function customAction(control: React.ReactNode): CustomActionType {
    return {
        type: 'custom',
        control,
    };
}
export function questionnaireAction<Extra = unknown>(
    title: React.ReactNode,
    questionnaireId: string,
    options?: { icon?: React.ReactNode; extra?: Extra },
): QuestionnaireActionType<Extra> {
    return {
        type: 'questionnaire',
        title,
        icon: options?.icon,
        questionnaireId,
        extra: options?.extra,
    };
}

export type ActionType<Extra = unknown, Link = string> =
    | QuestionnaireActionType<Extra>
    | NavigationActionType<Link>
    | CustomActionType;
export function isQuestionnaireAction<Extra = unknown>(
    action: ActionType<Extra>,
): action is QuestionnaireActionType<Extra> {
    return action.type === 'questionnaire';
}
export function isNavigationAction<Link = string>(
    action: ActionType<unknown, Link>,
): action is NavigationActionType<Link> {
    return action.type === 'navigation';
}
export function isCustomAction(action: ActionType): action is CustomActionType {
    return action.type === 'custom';
}
