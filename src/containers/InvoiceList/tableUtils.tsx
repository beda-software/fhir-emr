import {
    CheckCircleOutlined,
    FormOutlined,
    StopOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { PagerManager } from 'fhir-react';
import _ from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';

import { formatHumanDateTime } from 'src/utils/date';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { ModalCancelInvoice } from './components/ModalCancelInvoice';
import { ModalPayInvoice } from './components/ModalPayInvoice';
import { getPractitionerName, getInvoicePractitioner, getPatientName, getInvoicePatient, formatMoney } from './utils';

export function InvoiceStatus({ invoice }: { invoice: Invoice }) {
    const statusDataMapping = {
        balanced: {
            icon: <CheckCircleOutlined />,
            color: 'success',
            name: 'Balanced',
        },
        cancelled: {
            icon: <StopOutlined />,
            color: 'warning',
            name: 'Cancelled',
        },
        issued: {
            icon: <ClockCircleOutlined />,
            color: 'processing',
            name: 'Issued',
        },
        draft: {
            icon: <FormOutlined />,
            color: 'default',
            name: 'Draft',
        },
        'entered-in-error': {
            icon: <ExclamationCircleOutlined />,
            color: 'error',
            name: 'Entered in error',
        },
    };

    const { icon, color, name } = statusDataMapping[invoice.status];

    return (
        <Tag icon={icon} color={color}>
            {name}
        </Tag>
    );
}

export function InvoiceAmount({ invoice }: { invoice: Invoice }) {
    const priceComponents = _.flatten(invoice.lineItem?.map((lineItem) => lineItem.priceComponent));
    return formatMoney(_.sum(priceComponents.map((priceComponent) => priceComponent?.amount?.value ?? 0)));
}

export function InvoiceActions({
    manager,
    invoice,
    simplified,
}: {
    manager: PagerManager;
    invoice: Invoice;
    simplified?: boolean;
}) {
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
    pagerManager: PagerManager,
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
            width: '30%',
            render: (_text, resource) => <InvoiceActions manager={pagerManager} invoice={resource} simplified />,
        },
    ];

    return tableColumns.filter((column) => !excludeColumnKeys.includes(String(column.key)));
}
