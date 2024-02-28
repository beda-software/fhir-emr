import { ContactsOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';

import { DashboardCard } from 'src/components/DashboardCard';
import { PatientOverviewProps } from 'src/containers/PatientDetails/PatientOverviewDynamic';
import { EditPatient } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/EditPatient';
import s from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.module.scss';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';

interface Props {
    patientDetails: (
        | {
              title: string;
              value: string | undefined;
          }
        | {
              title: string;
              value: number | undefined;
          }
    )[];
    props: PatientOverviewProps;
}

export function GeneralInformationDashboard({ patientDetails, props }: Props) {
    return (
        <DashboardCard title={t`General Information`} extra={<EditPatient {...props} />} icon={<ContactsOutlined />}>
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

GeneralInformationDashboard.displayName = 'GeneralInformation';
