import { createContext, useState } from 'react';

import { Dashboard } from 'src/components/Dashboard/types';
import { Role } from 'src/utils/role';

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

interface Props {
    dashboard: Dashboard;
    children: JSX.Element;
}

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
