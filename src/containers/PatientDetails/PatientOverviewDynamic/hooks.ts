import { useContext } from 'react';

import { PatientDashboardContext } from 'src/contexts/PatientDashboardContext';

export function useDashboard() {
    const { patientDashboard } = useContext(PatientDashboardContext);
    // TODO select dashboard based on the role
    return patientDashboard.default;
}
