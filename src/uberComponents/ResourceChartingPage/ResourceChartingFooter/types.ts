import { FhirResource } from 'fhir/r4b';

import { ResourceChartingPageProps, ResourceWithId } from '../types';

export interface ResourceChartingFooterProps<R extends ResourceWithId> {
    resource: FhirResource;
    actions: ResourceChartingPageProps<R>['footerActions'];
    reload: () => void;
}
