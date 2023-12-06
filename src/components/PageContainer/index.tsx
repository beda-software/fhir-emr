import { Col, Row } from 'antd';

import { BasePageHeader, BasePageContent } from '../BaseLayout';
import { Title } from '../Typography';

interface PageContainerProps {
    title: string;
    titleRightContent?: React.ReactElement;
    headerContent?: React.ReactElement;
    content?: React.ReactElement;
}

export function PageContainer(props: PageContainerProps) {
    const { title, titleRightContent, headerContent, content } = props;
    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 40 }} gutter={[16, 16]}>
                    <Col>
                        <Title>{title}</Title>
                    </Col>
                    <Col>{titleRightContent}</Col>
                </Row>
                {headerContent}
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>{content}</BasePageContent>
        </>
    );
}
