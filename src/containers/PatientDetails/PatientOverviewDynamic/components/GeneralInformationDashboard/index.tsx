import { ContactsOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Patient } from 'fhir/r4b';

import { DashboardCard } from 'src/components/DashboardCard';
import { EditPatient } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/EditPatient';
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
            <S.DetailsRow>
                {patientDetails.map(({ title, value }, index) => (
                    <S.DetailItem key={`patient-details__${index}`}>
                        <S.DetailsTitle>{title}</S.DetailsTitle>
                        <div>{value || '-'}</div>
                    </S.DetailItem>
                ))}
            </S.DetailsRow>
        </DashboardCard>
    );
}
