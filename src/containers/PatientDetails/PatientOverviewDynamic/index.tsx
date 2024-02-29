import { Patient } from 'fhir/r4b';
import { useContext } from 'react';

import { Dashboards } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/Dashboards';
import { PatientDashboardContext } from 'src/contexts/PatientDashboardContext';

import s from './PatientOverview.module.scss';

export interface PatientOverviewProps {
    patient: Patient;
    reload: () => void;
}

export function PatientOverview(props: PatientOverviewProps) {
    const { patientDashboard } = useContext(PatientDashboardContext);

    return (
        <div className={s.container}>
            <Dashboards widgets={patientDashboard.default.top} {...props} />
            <div className={s.cards}>
                <div className={s.column}>
                    <Dashboards widgets={patientDashboard.default.left} {...props} />
                </div>
                <div className={s.column}>
                    <Dashboards widgets={patientDashboard.default.right} {...props} />
                </div>
            </div>
            <Dashboards widgets={patientDashboard.default.bottom} {...props} />
        </div>
    );
}
