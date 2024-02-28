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
            <Dashboards patient={props.patient} widgets={patientDashboard.default.top} />
            <div className={s.cards}>
                <div className={s.column}>
                    <Dashboards patient={props.patient} widgets={patientDashboard.default.left} />
                </div>
                <div className={s.column}>
                    <Dashboards patient={props.patient} widgets={patientDashboard.default.right} />
                </div>
            </div>
            <Dashboards patient={props.patient} widgets={patientDashboard.default.bottom} />
        </div>
    );
}
