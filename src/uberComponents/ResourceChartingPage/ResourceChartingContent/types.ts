import { FhirResource } from 'fhir/r4b';

import { ResourceChartingPageProps, ChartingItem, PreparedAttribute, ResourceWithId } from '../types';

export interface ResourceChartingContentProps<R extends ResourceWithId> {
    title: string;
    resource: FhirResource;
    reload: () => void;
    attributes?: PreparedAttribute[];
    resourceActions: ResourceChartingPageProps<R>['resourceActions'];
    chartedItems?: {
        title: string;
        itemsCount?: number;
        items?: string[][];
        actions?: ChartingItem['actions'];
    }[];
    footerActions: ResourceChartingPageProps<R>['footerActions'];
}
