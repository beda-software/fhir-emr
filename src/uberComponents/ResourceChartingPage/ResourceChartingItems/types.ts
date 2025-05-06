import { ChartingItem } from '../types';
import { FhirResource } from 'fhir/r4b';

export interface ResourceChartingItemsProps {
    resource: FhirResource,
    reload: () => void,
    data?: {
        title: string,
        items?: string[][];
        actions?: ChartingItem['actions']
    }[],
}
