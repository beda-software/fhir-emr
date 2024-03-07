import { CalendarOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Appointment } from 'fhir/r4b';

import { DashboardCard } from 'src/components/DashboardCard';
import { prepareAppointmentDetails } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/prepare';
import { StartEncounter } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StartEncounter';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';

interface Props {
    appointment: Appointment;
}

export function AppointmentCard({ appointment }: Props) {
    const appointmentDetails = prepareAppointmentDetails(appointment);

    return (
        <DashboardCard
            key={`card-appointment-${appointment.id}`}
            title={t`Upcoming appointment`}
            extra={<StartEncounter appointmentId={appointment.id!} />}
            icon={<CalendarOutlined />}
        >
            <S.DetailsRow>
                {appointmentDetails.map(({ title, value }, index) => (
                    <S.DetailItem key={`patient-details__${index}`}>
                        <S.DetailsTitle>{title}</S.DetailsTitle>
                        <div>{value || '-'}</div>
                    </S.DetailItem>
                ))}
            </S.DetailsRow>
        </DashboardCard>
    );
}
