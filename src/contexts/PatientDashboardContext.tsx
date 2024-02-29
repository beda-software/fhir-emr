import {
    AllergyIntolerance,
    Condition,
    Consent,
    Immunization,
    MedicationStatement,
    Observation,
    Patient,
    Provenance,
    ServiceRequest,
    Appointment,
    Encounter,
} from 'fhir/r4b';
import { createContext, useState } from 'react';

import { SearchParams } from '@beda.software/fhir-react';

import { Role } from 'src/utils/role';

interface WidgetComponent extends React.FunctionComponent<never> {
    displayName: string;
}

export type Resource =
    | AllergyIntolerance
    | Condition
    | Immunization
    | MedicationStatement
    | Consent
    | Observation
    | Provenance
    | ServiceRequest
    | Appointment
    | Encounter;

export interface Query {
    resourceType: Resource['resourceType'];
    search: (patient: Patient) => SearchParams;
}

export interface WidgetInfo {
    query: Query;
    widget: WidgetComponent;
}

interface Dashboard {
    default: {
        top: WidgetInfo[];
        right: WidgetInfo[];
        left: WidgetInfo[];
        bottom: WidgetInfo[];
    };
}

interface Props {
    dashboard: Dashboard;
    children: JSX.Element;
}

interface DashboardContextType {
    patientDashboard: Dashboard;
    updatePatientDashboard: (role: Role, updatedDashboard: Dashboard) => void;
}

const defaultDashboardContextValue: DashboardContextType = {
    patientDashboard: {
        default: {
            top: [],
            right: [],
            left: [],
            bottom: [],
        },
    },
    updatePatientDashboard: () => {
        console.log('updatePatientDashboard');
    },
};

export const PatientDashboardContext = createContext<DashboardContextType>(defaultDashboardContextValue);

export function PatientDashboardProvider({ dashboard, children }: Props) {
    const [patientDashboard, setPatientDashboard] = useState(dashboard);

    const updatePatientDashboard = (role: Role, updatedDashboard: Dashboard) => {
        setPatientDashboard((prevDashboards) => ({
            ...prevDashboards,
            [role]: updatedDashboard,
        }));
    };

    return (
        <PatientDashboardContext.Provider value={{ patientDashboard, updatePatientDashboard }}>
            {children}
        </PatientDashboardContext.Provider>
    );
}
