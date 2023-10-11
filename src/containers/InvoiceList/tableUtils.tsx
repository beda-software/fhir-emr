import {
    CheckCircleOutlined,
    FormOutlined,
    StopOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Tag, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Invoice, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';
import { PagerManager } from 'fhir-react';
import _ from 'lodash';

import { formatHumanDateTime } from 'src/utils/date';
import { matchCurrentUserRole, Role } from 'src/utils/role';

import { ModalCancelInvoice } from './components/ModalCancelInvoice';
import { ModalPayInvoice } from './components/ModalPayInvoice';
import { getPractitionerName, getInvoicePractitioner, getPatientName, getInvoicePatient } from './utils';

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
    return _.sum(priceComponents.map((priceComponent) => priceComponent?.amount?.value ?? 0));
}

export function InvoiceActions({ manager, invoice }: { manager: PagerManager; invoice: Invoice }) {
    return (
        <Row>
            <Col>
                <ModalCancelInvoice onSuccess={manager.reload} invoice={invoice} />
            </Col>
            <Col>
                <ModalPayInvoice onSuccess={manager.reload} invoice={invoice} />
            </Col>
        </Row>
    );
}

export function getInvoiceTableColumns(
    practitioners: Practitioner[],
    practitionerRoles: PractitionerRole[],
    patients: Patient[],
    pagerManager: PagerManager,
) {
    const excludeColumnKeys = matchCurrentUserRole({
        [Role.Admin]: () => [],
        [Role.Patient]: () => ['patient', 'actions'],
        [Role.Practitioner]: () => [],
        [Role.Receptionist]: () => [],
    });

    const tableColumns: ColumnsType<Invoice> = [
        {
            title: <Trans>Practitioner</Trans>,
            dataIndex: 'practitioner',
            key: 'practitioner',
            width: '20%',
            render: (_text, resource) =>
                getPractitionerName(getInvoicePractitioner(resource, practitioners, practitionerRoles)),
        },
        {
            title: <Trans>Patient</Trans>,
            dataIndex: 'patient',
            key: 'patient',
            width: '20%',
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
            width: '20%',
            render: (_text, resource) => <InvoiceActions manager={pagerManager} invoice={resource} />,
        },
    ];

    return tableColumns.filter((column) => !excludeColumnKeys.includes(String(column.key)));
}
