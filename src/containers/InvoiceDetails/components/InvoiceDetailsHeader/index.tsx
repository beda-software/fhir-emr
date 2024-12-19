import { t } from '@lingui/macro';
import { Col, Row, Statistic } from 'antd';

import { getInvoiceStatusHumanized } from 'src/containers/InvoiceList/tableUtils';
import { formatHumanDateTime } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';

import { InvoiceDetailsHeaderProps } from './types';

export function InvoiceDetailsHeader(props: InvoiceDetailsHeaderProps) {
    const { invoice, patient, practitioner } = props;

    return (
        <>
            <Row gutter={16}>
                <Col span={6}>
                    <Statistic title={t`Patient`} value={renderHumanName(patient?.name?.[0])} />
                </Col>
                <Col span={6}>
                    <Statistic title={t`Practitioner`} value={renderHumanName(practitioner?.name?.[0])} />
                </Col>
                <Col span={6}>
                    <Statistic title={t`Date`} value={formatHumanDateTime(invoice?.date)} />
                </Col>
                <Col span={6}>
                    <Statistic title={t`Status`} value={getInvoiceStatusHumanized(invoice)} />
                </Col>
            </Row>
        </>
    );
}
