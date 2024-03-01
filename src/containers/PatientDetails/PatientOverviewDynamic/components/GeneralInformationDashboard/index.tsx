import { ContactsOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Patient } from 'fhir/r4b';

import { DashboardCard } from 'src/components/DashboardCard';
import { EditPatient } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/EditPatient';
import s from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.module.scss';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';

interface Props {
    patientDetails: {
        title: string;
        value?: string | number;
    }[];
    patient: Patient;
}

export function GeneralInformationDashboard({ patientDetails, patient }: Props) {
    return (
        <DashboardCard
            title={t`General Information`}
            extra={<EditPatient patient={patient} />}
            icon={<ContactsOutlined />}
        >
            <div className={s.detailsRow}>
                {patientDetails.map(({ title, value }, index) => (
                    <div key={`patient-details__${index}`} className={s.detailItem}>
                        <S.DetailsTitle>{title}</S.DetailsTitle>
                        <div className={s.detailsValue}>{value || '-'}</div>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
}
