import { FhirResource, Patient } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

export interface Query {
    resourceType: FhirResource['resourceType'];
    search: (patient: Patient) => SearchParams;
}

export interface WidgetProps {
    patient: Patient;
    widgetInfo: WidgetInfo;
}

export type DashboardAreas = 'top' | 'right' | 'left' | 'bottom';

export interface WidgetInfo {
    widget: React.FunctionComponent<WidgetProps>;
    query?: Query;
}

export type DashboardInstance = Record<DashboardAreas, WidgetInfo[]>;

export interface Dashboard {
    default: DashboardInstance;
}

export interface ContainerProps {
    patient: Patient;
    widgetInfo: WidgetInfo;
}
