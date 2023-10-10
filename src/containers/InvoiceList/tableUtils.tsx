import {
    CheckCircleOutlined,
    IssuesCloseOutlined,
    InfoCircleOutlined,
    FormOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { Tag, Row, Col } from 'antd';
import { Invoice } from 'fhir/r4b';
import { PagerManager } from 'fhir-react';
import _ from 'lodash';

import { ModalCancelInvoice } from './components/ModalCancelInvoice';
import { ModalPayInvoice } from './components/ModalPayInvoice';

export function InvoiceStatus({ invoice }: { invoice: Invoice }) {
    const statusDataMapping = {
        balanced: {
            icon: <CheckCircleOutlined />,
            color: 'success',
            name: 'Balanced',
        },
        cancelled: {
            icon: <IssuesCloseOutlined />,
            color: 'warning',
            name: 'Cancelled',
        },
        issued: {
            icon: <InfoCircleOutlined />,
            color: 'processing',
            name: 'Issued',
        },
        draft: {
            icon: <FormOutlined />,
            color: 'default',
            name: 'Draft',
        },
        'entered-in-error': {
            icon: <StopOutlined />,
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
