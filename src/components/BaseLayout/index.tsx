import { ReactNode } from 'react';

import { S } from './BaseLayout.styles';
import { AppFooter } from './Footer';
import { AppSidebar } from './Sidebar';
import { AppTabBar } from './TabBar';

interface Props {
    children: ReactNode;
    style?: React.CSSProperties;
    className?: string | undefined;
}

export function BaseLayout({ children, style, className }: Props) {
    return (
        <S.Container style={style} className={className}>
            <AppSidebar />
            <AppTabBar />
            <S.Layout>
                {children}
                <AppFooter />
            </S.Layout>
        </S.Container>
    );
}

export function AnonymousLayout({ children, style, className }: Props) {
    return (
        <S.Container style={style} className={className}>
            <AppSidebar />
            <S.Layout>
                {children}
                <AppFooter />
            </S.Layout>
        </S.Container>
    );
}

export type BasePageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
    maxWidth?: number | string;
};

export function BasePageHeader(props: BasePageHeaderProps) {
    const { maxWidth, ...rest } = props;

    return (
        <S.PageHeaderContainer>
            <S.PageHeader {...rest} $maxWidth={maxWidth} />
        </S.PageHeaderContainer>
    );
}

export type BasePageContentProps = React.HTMLAttributes<HTMLDivElement> & {
    maxWidth?: number | string;
};

export function BasePageContent(props: BasePageContentProps) {
    const { maxWidth, ...rest } = props;

    return (
        <S.PageContentContainer>
            <S.PageContent {...rest} $maxWidth={maxWidth} />
        </S.PageContentContainer>
    );
}
