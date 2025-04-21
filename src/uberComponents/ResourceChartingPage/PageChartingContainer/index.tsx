import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { useTheme } from 'styled-components';

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

    const theme = useTheme();

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
                    {chartingPanelActive && (
                        <Sider
                            width="240"
                            style={{
                                height: '100%',
                                backgroundColor: theme.neutralPalette.gray_1,
                                borderRight: `1px solid ${theme.neutral.dividers}`,
                            }}
                        >
                            {chartingHeader ? chartingHeader : null}
                            {chartingContent}
                        </Sider>
                    )}

                    <S.ChartingPanelToggler $chartingPanelActive={chartingPanelActive} onClick={toggleChartingPanel}>
                        {chartingPanelActive ? <LeftOutlined /> : <RightOutlined />}
                    </S.ChartingPanelToggler>
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
