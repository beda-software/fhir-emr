import { Col, Row, Statistic } from 'antd';
import { Invoice, Patient, Practitioner } from 'fhir/r4b';

import { formatHumanDateTime } from 'shared/src/utils/date';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BasePageHeader } from 'src/components/BaseLayout';
import { Title } from 'src/components/Typography';

export function InvoiceDetailsHeader({
    invoice,
    patient,
    practitioner,
}: {
    invoice: Invoice;
    patient: Patient;
    practitioner: Practitioner;
}) {
    return (
        <BasePageHeader style={{ paddingBottom: 0 }}>
            <Title style={{ marginBottom: 21 }}>Medical Services Invoice</Title>
            <Row gutter={16}>
                <Col span={6}>
                    <Statistic title="Patient" value={renderHumanName(patient.name?.[0])} />
                </Col>
                <Col span={6}>
                    <Statistic title="Practitioner" value={renderHumanName(practitioner.name?.[0])} />
                </Col>
                <Col span={6}>
                    <Statistic title="Date" value={formatHumanDateTime(invoice.date)} />
                </Col>
                <Col span={6}>
                    <Statistic title="Status" value={invoice.status} />
                </Col>
            </Row>
        </BasePageHeader>
    );
}
