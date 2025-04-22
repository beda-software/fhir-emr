import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { useState } from 'react';

import { PageContainerProps } from 'src/components';
import { S as LayoutStyle } from 'src/components/BaseLayout/PageContainer/styles';

import { S } from './styles';
import { getChartingPanelState, setChartingPanelState } from '../utils';

interface PageChartingContainerProps extends PageContainerProps {
    chartingHeader?: React.ReactNode;
    chartingContent?: React.ReactNode;
}

export function PageChartingContainer(props: PageChartingContainerProps) {
    const {
        layoutVariant = 'default',
        title,
        headerContent,
        children,
        maxWidth,
        titleLeftElement,
        titleRightElement,
        chartingContent,
        chartingHeader,
    } = props;

    const [chartingPanelActive, setChartingPanelActive] = useState(getChartingPanelState());

    const toggleChartingPanel = () => {
        setChartingPanelActive((prev) => {
            setChartingPanelState(!prev);
            return !prev;
        });
    };

    return (
        <Layout>
            {chartingContent ? (
                <S.ChartingPanel>
                    <S.Sider width={chartingPanelActive ? '240' : '8'}>
                        {chartingPanelActive && (
                            <>
                                {chartingHeader ? chartingHeader : null}
                                {chartingContent}
                            </>
                        )}
                    </S.Sider>

                    <S.ChartingPanelTogglerWrapper $chartingPanelActive={chartingPanelActive}>
                        <S.ChartingPanelToggler
                            $chartingPanelActive={chartingPanelActive}
                            onClick={toggleChartingPanel}
                        >
                            {chartingPanelActive ? <LeftOutlined /> : <RightOutlined />}
                        </S.ChartingPanelToggler>
                    </S.ChartingPanelTogglerWrapper>
                </S.ChartingPanel>
            ) : null}

            <Layout>
                <LayoutStyle.HeaderContainer maxWidth={maxWidth} $variant={layoutVariant}>
                    <LayoutStyle.Header>
                        <LayoutStyle.HeaderLeftColumn>
                            {titleLeftElement ? (
                                titleLeftElement
                            ) : (
                                <>{title && <PageContainerTitle>{title}</PageContainerTitle>}</>
                            )}
                        </LayoutStyle.HeaderLeftColumn>
                        {titleRightElement && (
                            <LayoutStyle.HeaderRightColumn>{titleRightElement}</LayoutStyle.HeaderRightColumn>
                        )}
                    </LayoutStyle.Header>
                    {headerContent}
                </LayoutStyle.HeaderContainer>

                <LayoutStyle.ContentContainer $variant={layoutVariant} maxWidth={maxWidth}>
                    {children}
                </LayoutStyle.ContentContainer>
            </Layout>
        </Layout>
    );
}

export function PageContainerTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return <LayoutStyle.Title level={3} {...props} />;
}
