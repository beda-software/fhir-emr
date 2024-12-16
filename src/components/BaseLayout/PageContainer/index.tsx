import { S } from './styles';
import { BasePageContentProps, BasePageHeaderProps } from '..';

export interface PageContainerProps {
    variant?: 'default' | 'with-table' | 'with-tabs';
    maxWidth?: number | string;
    title?: React.ReactNode;
    headerLeftColumn?: React.ReactNode;
    headerRightColumn?: React.ReactNode;
    children?: React.ReactNode;

    header?: BasePageHeaderProps;
    content?: BasePageContentProps;
}

export function PageContainer(props: PageContainerProps = {}) {
    const {
        variant = 'default',
        title,
        header,
        content,
        children,
        maxWidth,
        headerLeftColumn,
        headerRightColumn,
    } = props;

    return (
        <>
            <S.HeaderContainer maxWidth={maxWidth} $variant={variant} {...header}>
                <S.Header>
                    <S.HeaderLeftColumn>
                        {headerLeftColumn ? (
                            headerLeftColumn
                        ) : (
                            <>{title && <PageContainerTitle>{title}</PageContainerTitle>}</>
                        )}
                    </S.HeaderLeftColumn>
                    {headerRightColumn && <S.HeaderRightColumn>{headerRightColumn}</S.HeaderRightColumn>}
                </S.Header>
                {header?.children}
            </S.HeaderContainer>
            <S.ContentContainer $variant={variant} maxWidth={maxWidth} {...content}>
                {content?.children ?? children}
            </S.ContentContainer>
        </>
    );
}

export function PageContainerTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return <S.Title level={3} {...props} />;
}
