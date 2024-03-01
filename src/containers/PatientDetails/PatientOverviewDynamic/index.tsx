import { Patient } from 'fhir/r4b';

import { Dashboards } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/Dashboards';
import { useDashboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/hooks';

import s from './PatientOverview.module.scss';

interface Props {
    patient: Patient;
}

export function PatientOverview(props: Props) {
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
