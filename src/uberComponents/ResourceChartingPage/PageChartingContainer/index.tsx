import { Splitter } from 'antd';
import { PageContainerProps } from 'src/components';
import { S } from 'src/components/BaseLayout/PageContainer/styles';

interface PageChartingContainerProps extends PageContainerProps {
    splitterHeader?: React.ReactNode;
    splitterContent?: React.ReactNode;
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
        splitterContent,
        splitterHeader,
    } = props;

    const withSplitter = splitterHeader || splitterContent;

    return (
        <Splitter style={{ height: '100%', width: '100%' }}>
            {splitterContent ? (
                <Splitter.Panel resizable={false} size={240} min={0} max={240} collapsible={true}>
                    {splitterHeader ? splitterHeader : null}
                    {splitterContent}
                </Splitter.Panel>
            ) : null}

            <Splitter.Panel collapsible={false} style={{ width: withSplitter ? 'calc(100% - 240px)' : '100%' }}>
                <S.HeaderContainer maxWidth={maxWidth} $variant={layoutVariant}>
                    <S.Header>
                        <S.HeaderLeftColumn>
                            {titleLeftElement ? (
                                titleLeftElement
                            ) : (
                                <>{title && <PageContainerTitle>{title}</PageContainerTitle>}</>
                            )}
                        </S.HeaderLeftColumn>
                        {titleRightElement && <S.HeaderRightColumn>{titleRightElement}</S.HeaderRightColumn>}
                    </S.Header>
                    {headerContent}
                </S.HeaderContainer>
                <S.ContentContainer $variant={layoutVariant} maxWidth={maxWidth}>
                    {children}
                </S.ContentContainer>
            </Splitter.Panel>
        </Splitter>
    );
}

export function PageContainerTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return <S.Title level={3} {...props} />;
}
