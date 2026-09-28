import { CarePlan, Patient } from 'fhir/r4b';
import { Route } from 'react-router-dom';

import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';

export interface PatientDetailsEmbeddedPageDefinition extends RouteItem {
    routes: Array<ReturnType<typeof Route>>;
}

export interface PatientDetailsProps {
    embeddedPages?: (patient: Patient, carePlans: CarePlan[]) => PatientDetailsEmbeddedPageDefinition[];
    isDefaultRoutesDisabled?: boolean;
}
