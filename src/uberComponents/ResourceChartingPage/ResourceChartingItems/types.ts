import { FhirResource } from 'fhir/r4b';

import { ChartingItem } from '../types';

export interface ResourceChartingItemsProps {
    resource: FhirResource;
    reload: () => void;
    data?: {
        title: string;
        itemsCount?: number;
        items?: string[][];
        actions?: ChartingItem['actions'];
    }[];
}
