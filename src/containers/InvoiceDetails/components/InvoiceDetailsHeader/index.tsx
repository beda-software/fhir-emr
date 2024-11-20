import { Col, Row, Statistic } from 'antd';

import { BasePageHeader } from 'src/components/BaseLayout';
import { Title } from 'src/components/Typography';
import { getInvoiceStatusHumanized } from 'src/containers/InvoiceList/tableUtils';
import { formatHumanDateTime } from 'src/utils/date';
import { renderHumanName } from 'src/utils/fhir';

import { InvoiceDetailsHeaderProps } from './types';
import { t, Trans } from '@lingui/macro';

export function InvoiceDetailsHeader(props: InvoiceDetailsHeaderProps) {
    const { invoice, patient, practitioner } = props;

    return (
        <BasePageHeader style={{ paddingBottom: 0 }}>
            <Title style={{ marginBottom: 21 }}><Trans>Medical Services Invoice</Trans></Title>
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
        </BasePageHeader>
    );
}
