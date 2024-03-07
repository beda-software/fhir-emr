import { Patient } from 'fhir/r4b';

import { Dashboards } from 'src/components/Dashboard';
import { useDashboard } from 'src/components/Dashboard/contexts';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';

interface Props {
    patient: Patient;
}

export function PatientOverview({ patient }: Props) {
    const patientDashboard = useDashboard();

    return (
        <S.Container>
            <Dashboards widgets={patientDashboard.top} patient={patient} />
            <S.Cards>
                <S.Column>
                    <Dashboards widgets={patientDashboard.left} patient={patient} />
                </S.Column>
                <S.Column>
                    <Dashboards widgets={patientDashboard.right} patient={patient} />
                </S.Column>
            </S.Cards>
            <Dashboards widgets={patientDashboard.bottom} patient={patient} />
        </S.Container>
    );
}
