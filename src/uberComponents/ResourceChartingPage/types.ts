import { Resource, FhirResource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { Tab } from '../ResourceDetailPage/types';
import { QuestionnaireActionType } from '../ResourceListPage/actions';
import { ResourceListBaseProps } from '../ResourceListPage/types';
import { TypedFHIRPathExpression } from '../types';

export type ResourceWithId = WithId<Resource>;

type ResourceChartingPageSingleAttribute<R extends Resource> = {
    icon: React.ReactNode;
    getText: TypedFHIRPathExpression<R>;
    key: string;
};

type ResourceChartingPageAttributes<R extends Resource> = Array<ResourceChartingPageSingleAttribute<R>>;

export type ChartingItem = {
    title: string;
    resourceType: Resource['resourceType'];
    columns: Array<TypedFHIRPathExpression<Resource>>;
    actions?: Array<QuestionnaireActionType>;
};

export type ResourceChartingPageProps<R extends ResourceWithId> = ResourceListBaseProps<R> & {
    title: TypedFHIRPathExpression<R>;
    attributesToDisplay?: ResourceChartingPageAttributes<R>;
    resourceActions?: Array<QuestionnaireActionType>;
    tabs?: Array<Tab<WithId<R>>>;
    chartingItems?: Array<ChartingItem>;
    footerActions?: Array<QuestionnaireActionType>;
};

export type PreparedAttribute = {
    icon: React.ReactNode;
    data: string;
    key: string;
};

export type ResourceChartingHeaderProps<R extends ResourceWithId> = {
    title: string;
    resource: FhirResource;
    reload: () => void;
    preparedAttributes?: PreparedAttribute[];
    resourceActions?: Array<QuestionnaireActionType>;
};
