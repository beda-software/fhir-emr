import { createContext, useState } from 'react';

import { Dashboard } from 'src/components/Dashboard/types';

interface DashboardContextType {
    patientDashboard: Dashboard;
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
};

export const PatientDashboardContext = createContext<DashboardContextType>(defaultDashboardContextValue);

interface Props {
    dashboard: Dashboard;
    children: JSX.Element;
}

export function PatientDashboardProvider({ dashboard, children }: Props) {
    const [patientDashboard] = useState(dashboard);

    return <PatientDashboardContext.Provider value={{ patientDashboard }}>{children}</PatientDashboardContext.Provider>;
}
