import { Dashboard } from 'src/components/Dashboard/types';
import { patientDashboardConfig } from 'src/containers/PatientDetails/Dashboard/config';

// import { Role } from './utils/role';

export const dashboard: Dashboard = {
    default: patientDashboardConfig,
    // [Role.Admin]: {},
    // [Role.Practitioner]: {},
};
