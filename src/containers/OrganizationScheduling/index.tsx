import { Trans } from '@lingui/macro';
import { Col, Row } from 'antd';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { Title } from 'src/components/Typography';

export function OrganizationScheduling() {
    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                    <Col>
                        <Title style={{ marginBottom: 0 }}>
                            <Trans>Scheduling</Trans>
                        </Title>
                    </Col>
                </Row>
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <p>Scheduling content</p>
            </BasePageContent>
        </>
    );
}
