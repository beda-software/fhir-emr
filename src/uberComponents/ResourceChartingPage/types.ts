import { Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { Tab } from '../ResourceDetailPage/types';
import { QuestionnaireActionType } from '../ResourceListPage/actions';
import { ResourceListBaseProps } from '../ResourceListPage/types';
import { TypedFHIRPathExpression } from '../types';

type ResourceChartingPageSingleAttribute<R extends Resource> = {
    icon: React.ReactNode;
    getText: TypedFHIRPathExpression<R>;
};

type ResourceChartingPageAttributes<R extends Resource> = Array<ResourceChartingPageSingleAttribute<R>>;

type ChartingItemColumn = {
    getText: TypedFHIRPathExpression<Resource>;
};

export type ChartingItem = {
    title: string;
    resourceType: Resource['resourceType'];
    columns: Array<ChartingItemColumn>;
    actions?: Array<QuestionnaireActionType>;
};

export type ResourceChartingPageProps<R extends WithId<Resource>> = ResourceListBaseProps<R> & {
    title: TypedFHIRPathExpression<R>;
    attributesToDisplay?: ResourceChartingPageAttributes<R>;
    resourceActions?: Array<QuestionnaireActionType>;
    tabs?: Array<Tab<WithId<R>>>;
    chartingItems?: Array<ChartingItem>;
    footerActions?: Array<QuestionnaireActionType>;
};

export type ResourceChartingHeaderProps = {
    title: string;
    preparedAttributes:
        | {
              icon: React.ReactNode;
              data: string | undefined;
          }[]
        | undefined;
    resourceActions?: Array<QuestionnaireActionType>;
};
