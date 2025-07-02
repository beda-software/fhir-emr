import {
    CheckCircleOutlined,
    FormOutlined,
    StopOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import _ from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';

import { PagerManager } from '@beda.software/fhir-react';

import { formatHumanDateTime } from 'src/utils/date';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { ModalCancelInvoice } from './components/ModalCancelInvoice';
import { ModalPayInvoice } from './components/ModalPayInvoice';
import { InvoiceActionsProps } from './types';
import { getPractitionerName, getInvoicePractitioner, getPatientName, getInvoicePatient, formatMoney } from './utils';

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

export function InvoiceAmount({ invoice }: { invoice: Invoice }) {
    const priceComponents = _.flatten(invoice.lineItem?.map((lineItem) => lineItem.priceComponent));
    return formatMoney(_.sum(priceComponents.map((priceComponent) => priceComponent?.amount?.value ?? 0)));
}

export function InvoiceActions(props: InvoiceActionsProps) {
    const { manager, invoice, simplified } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const routeToOpen = `${location.pathname}/${invoice.id}`;
    const openDetailsButton = (
        <Button key={`open-invoice-${invoice.id}`} onClick={() => navigate(routeToOpen)} type="link">
            <Trans>Open</Trans>
        </Button>
    );

    if (simplified) {
        return openDetailsButton;
    }

    return (
        <>
            <ModalCancelInvoice onSuccess={manager.reload} invoice={invoice} />
            <ModalPayInvoice onSuccess={manager.reload} invoice={invoice} />
            {openDetailsButton}
        </>
    );
}

export function getInvoiceTableColumns(
    practitioners: Practitioner[],
    practitionerRoles: PractitionerRole[],
    patients: Patient[],
    pagerManager: PagerManager<Invoice | Patient | Practitioner | PractitionerRole>,
) {
    const excludeColumnKeys = matchCurrentUserRole({
        [Role.Admin]: () => ['patientActions'],
        [Role.Patient]: () => ['patient', 'actions'],
        [Role.Practitioner]: () => ['patientActions'],
        [Role.Receptionist]: () => ['patientActions'],
    });

    const tableColumns: ColumnsType<Invoice> = [
        {
            title: <Trans>Practitioner</Trans>,
            dataIndex: 'practitioner',
            key: 'practitioner',
            width: '15%',
            render: (_text, resource) =>
                getPractitionerName(getInvoicePractitioner(resource, practitioners, practitionerRoles)),
        },
        {
            title: <Trans>Patient</Trans>,
            dataIndex: 'patient',
            key: 'patient',
            width: '15%',
            render: (_text, resource) => getPatientName(getInvoicePatient(resource, patients)),
        },
        {
            title: <Trans>Date</Trans>,
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            render: (_text, resource) => formatHumanDateTime(resource.date ?? ''),
        },
        {
            title: <Trans>Status</Trans>,
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (_text, resource) => <InvoiceStatus invoice={resource} />,
        },
        {
            title: <Trans>Amount</Trans>,
            dataIndex: 'amount',
            key: 'amount',
            width: '10%',
            render: (_text, resource) => <InvoiceAmount invoice={resource} />,
        },
        {
            title: <Trans>Actions</Trans>,
            dataIndex: 'actions',
            key: 'actions',
            width: '30%',
            render: (_text, resource) => <InvoiceActions manager={pagerManager} invoice={resource} />,
        },
        {
            title: <Trans>Actions</Trans>,
            dataIndex: 'actions',
            key: 'patientActions',
            width: '10%',
            render: (_text, resource) => <InvoiceActions manager={pagerManager} invoice={resource} simplified />,
        },
    ];

    return tableColumns.filter((column) => !excludeColumnKeys.includes(String(column.key)));
}
