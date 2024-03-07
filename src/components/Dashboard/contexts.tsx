import { createContext, useContext } from 'react';

import { Dashboard } from 'src/components/Dashboard/types';

const defaultDashboard: Dashboard = {
    default: {
        top: [],
        right: [],
        left: [],
        bottom: [],
    },
};

export const PatientDashboardContext = createContext<Dashboard>(defaultDashboard);

interface Props {
    dashboard: Dashboard;
    children: JSX.Element;
}

export function PatientDashboardProvider({ dashboard, children }: Props) {
    return <PatientDashboardContext.Provider value={dashboard}>{children}</PatientDashboardContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboard() {
    const patientDashboard = useContext(PatientDashboardContext);
    // TODO select dashboard based on the role
    return patientDashboard.default;
}
