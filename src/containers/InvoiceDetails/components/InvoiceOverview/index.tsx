import { AuditOutlined } from '@ant-design/icons';

import { formatHumanDateTime } from 'shared/src/utils/date';
import { renderHumanName } from 'shared/src/utils/fhir';

import { DashboardCard } from 'src/components/DashboardCard';
import { InvoiceAmount, InvoiceStatus } from 'src/containers/InvoiceList/tableUtils';

import s from './InvoiceOverview.module.scss';
import { S } from './InvoiceOverview.styles';
import { InvoiceOverviewProps } from './types';

function useInvoiceOverview(props: InvoiceOverviewProps) {
    const { invoice, patient, practitioner } = props;

    const details = [
        {
            title: 'Status',
            value: <InvoiceStatus invoice={invoice} />,
        },
        {
            title: 'Date',
            value: formatHumanDateTime(invoice.date),
        },
        {
            title: 'Patient',
            value: renderHumanName(patient.name?.[0]),
        },
        {
            title: 'Practitioner',
            value: renderHumanName(practitioner.name?.[0]),
        },
        {
            title: 'Amount',
            value: <InvoiceAmount invoice={invoice} />,
        },
    ];

    return { details };
}

export function InvoiceOverview(props: InvoiceOverviewProps) {
    const { details } = useInvoiceOverview(props);

    return (
        <div className={s.container}>
            <DashboardCard title={`General Information`} icon={<AuditOutlined />} className={s.card}>
                <div className={s.details}>
                    {details.map(({ title, value }, index) => (
                        <S.DetailsItem key={`practitioner-details__${index}`}>
                            <S.DetailsTitle>{title}</S.DetailsTitle>
                            <S.DetailsValue>{value}</S.DetailsValue>
                        </S.DetailsItem>
                    ))}
                </div>
            </DashboardCard>
        </div>
    );
}
