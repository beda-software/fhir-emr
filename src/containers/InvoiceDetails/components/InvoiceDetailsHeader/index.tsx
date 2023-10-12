import { Col, Row, Statistic } from 'antd';

import { formatHumanDateTime } from 'shared/src/utils/date';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageHeader } from 'src/components/BaseLayout';
import { Title } from 'src/components/Typography';
import { getInvoiceStatusHumanized } from 'src/containers/InvoiceList/tableUtils';

import { InvoiceDetailsHeaderProps } from './types';

export function InvoiceDetailsHeader(props: InvoiceDetailsHeaderProps) {
    const { invoice, patient, practitioner } = props;
    return (
        <BasePageHeader style={{ paddingBottom: 0 }}>
            <Title style={{ marginBottom: 21 }}>Medical Services Invoice</Title>
            <Row gutter={16}>
                <Col span={6}>
                    <Statistic title="Patient" value={renderHumanName(patient?.name?.[0])} />
                </Col>
                <Col span={6}>
                    <Statistic title="Practitioner" value={renderHumanName(practitioner?.name?.[0])} />
                </Col>
                <Col span={6}>
                    <Statistic title="Date" value={formatHumanDateTime(invoice?.date)} />
                </Col>
                <Col span={6}>
                    <Statistic title="Status" value={getInvoiceStatusHumanized(invoice)} />
                </Col>
            </Row>
        </BasePageHeader>
    );
}
