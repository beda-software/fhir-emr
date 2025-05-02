import { Resource } from 'fhir/r4b';
import { ResourceListBaseProps } from '../ResourceListPage/types';
import { QuestionnaireActionType } from '../ResourceListPage/actions';
import { TypedFHIRPathExpression } from '../ResourceCalendarPage/types';
import { SearchParams } from '@beda.software/fhir-react';

import { WithId } from '@beda.software/fhir-react';

type ResourceChartingPageSingleAttribute<R extends Resource> = {
    icon: React.ReactNode;
    dataGetterFn: TypedFHIRPathExpression<R>
};

type ResourceChartingPageAttributes<R extends Resource> = Array<ResourceChartingPageSingleAttribute<R>>;

type ChartingItemColumn = {
    dataGetterFn: (r: Resource) => string;
    isLinkable?: boolean;
};

export type ChartingItem = {
    title: string;
    resourceType: string;
    columns: Array<ChartingItemColumn>;
    action?: QuestionnaireActionType;
    searchParams?: SearchParams;
    isPinnable?: boolean;
};

type FooterActionItem = {
    action: QuestionnaireActionType;
    actionType?: 'primary' | 'secondary';
};

type Tab = {
    title: string;
    path: string;
    content: React.ReactNode;
};

export type ResourceChartingPageProps<R extends WithId<Resource>> = ResourceListBaseProps<R> & {
    title: TypedFHIRPathExpression<R>;
    attributesToDisplay?: ResourceChartingPageAttributes<R>;
    resourceActions?: Array<QuestionnaireActionType>;
    basicTabs?: Array<Tab>;
    chartingItems?: Array<ChartingItem>;
    footerActions?: Array<FooterActionItem>;
};

export type ResourceChartingHeaderProps = {
    title: string;
    preparedAttributes: {
        icon: React.ReactNode;
        data: string | undefined;
    }[] | undefined;
    resourceActions?: Array<QuestionnaireActionType>;
}
