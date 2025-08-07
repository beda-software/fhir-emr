import {
    CheckCircleOutlined,
    FormOutlined,
    StopOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Tag } from 'antd';
import { Invoice } from 'fhir/r4b';

export function getInvoiceStatusHumanized(invoice?: Invoice) {
    const invoiceStatusMapping = {
        balanced: t`Balanced`,
        cancelled: t`Cancelled`,
        issued: t`Issued`,
        draft: t`Draft`,
        'entered-in-error': t`Entered in error`,
    };

    return invoice ? invoiceStatusMapping[invoice.status] : t`Unknown`;
}

export function InvoiceStatus({ invoice }: { invoice: Invoice }) {
    const statusDataMapping = {
        balanced: {
            icon: <CheckCircleOutlined />,
            color: 'success',
        },
        cancelled: {
            icon: <StopOutlined />,
            color: 'warning',
        },
        issued: {
            icon: <ClockCircleOutlined />,
            color: 'processing',
        },
        draft: {
            icon: <FormOutlined />,
            color: 'default',
        },
        'entered-in-error': {
            icon: <ExclamationCircleOutlined />,
            color: 'error',
        },
    };

    const { icon, color } = statusDataMapping[invoice.status];

    return (
        <Tag icon={icon} color={color}>
            {getInvoiceStatusHumanized(invoice)}
        </Tag>
    );
}
