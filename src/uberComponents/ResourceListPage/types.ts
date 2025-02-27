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

export interface NavigationActionType {
    type: 'navigation';
    title: React.ReactNode;
    link: string;
    icon?: React.ReactNode;
}

export interface CustomActionType {
    type: 'custom';
    control: React.ReactNode;
}

export interface QuestionnaireActionType<QRFProps = unknown> {
    type: 'questionnaire';
    title: React.ReactNode;
    questionnaireId: string;
    icon?: React.ReactNode;
    qrfProps?: Partial<QRFProps>;
}

export function navigationAction(
    title: React.ReactNode,
    link: string,
    options?: { icon?: React.ReactNode },
): NavigationActionType {
    return { type: 'navigation', title, link, icon: options?.icon };
}
export function customAction(control: React.ReactNode): CustomActionType {
    return {
        type: 'custom',
        control,
    };
}
export function questionnaireAction<QRFProps = unknown>(
    title: React.ReactNode,
    questionnaireId: string,
    options?: { icon?: React.ReactNode; qrfProps?: Partial<QRFProps> },
): QuestionnaireActionType {
    return {
        type: 'questionnaire',
        title,
        icon: options?.icon,
        qrfProps: options?.qrfProps,
        questionnaireId,
    };
}

export type ActionType = QuestionnaireActionType | NavigationActionType | CustomActionType;
export function isQuestionnaireAction(action: ActionType): action is QuestionnaireActionType {
    return action.type === 'questionnaire';
}
export function isNavigationAction(action: ActionType): action is NavigationActionType {
    return action.type === 'navigation';
}
export function isCustomAction(action: ActionType): action is CustomActionType {
    return action.type === 'custom';
}
