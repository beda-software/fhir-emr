import { Patient } from 'fhir/r4b';

import { Dashboards } from 'src/components/Dashboard';
import { useDashboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/hooks';

import s from './PatientOverview.module.scss';

interface Props {
    patient: Patient;
}

export function PatientOverview({ patient }: Props) {
    const patientDashboard = useDashboard();

    return (
        <div className={s.container}>
            <Dashboards widgets={patientDashboard.top} patient={patient} />
            <div className={s.cards}>
                <div className={s.column}>
                    <Dashboards widgets={patientDashboard.left} patient={patient} />
                </div>
                <div className={s.column}>
                    <Dashboards widgets={patientDashboard.right} patient={patient} />
                </div>
            </div>
            <Dashboards widgets={patientDashboard.bottom} patient={patient} />
        </div>
    );
}
