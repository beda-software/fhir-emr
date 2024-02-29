import { Patient } from 'fhir/r4b';
import { useContext } from 'react';

import { Dashboards } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/Dashboards';
import { PatientDashboardContext } from 'src/contexts/PatientDashboardContext';

import s from './PatientOverview.module.scss';

export interface PatientOverviewProps {
    patient: Patient;
    reload: () => void;
}

function useDashboard() {
    const { patientDashboard } = useContext(PatientDashboardContext);
    // TODO select dashboard based on the role
    return patientDashboard.default;
}

export function PatientOverview(props: PatientOverviewProps) {
    const patientDashboard = useDashboard();

    return (
        <div className={s.container}>
            <Dashboards widgets={patientDashboard.top} {...props} />
            <div className={s.cards}>
                <div className={s.column}>
                    <Dashboards widgets={patientDashboard.left} {...props} />
                </div>
                <div className={s.column}>
                    <Dashboards widgets={patientDashboard.right} {...props} />
                </div>
            </div>
            <Dashboards widgets={patientDashboard.bottom} {...props} />
        </div>
    );
}
