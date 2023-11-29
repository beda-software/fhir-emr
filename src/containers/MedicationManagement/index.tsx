import { Trans } from '@lingui/macro';
import { Row, Col, Tabs } from 'antd';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { Title } from 'src/components/Typography';

import { MedicationKnowledgeList } from './MedicationKnowledgeList';

export function MedicationManagement() {
    const items = [
        { label: 'Prescriptions', key: 'prescriptions', children: <div>Hi</div> },
        { label: 'Management', key: 'management', children: <MedicationKnowledgeList /> },
    ];

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Medications</Trans>
                        </Title>
                    </Col>
                </Row>
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <Tabs items={items} />
            </BasePageContent>
        </>
    );
}
