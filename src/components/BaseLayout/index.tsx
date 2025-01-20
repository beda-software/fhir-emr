import { Layout } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';

import s from './BaseLayout.module.scss';
import { S } from './BaseLayout.styles';
import { AppFooter } from './Footer';
import { AppSidebar } from './Sidebar';
import { AppTabBar } from './TabBar';

interface Props {
    children: ReactNode;
    style?: React.CSSProperties;
}

export function BaseLayout({ children, style }: Props) {
    return (
        <S.Container style={style}>
            <AppSidebar />
            <AppTabBar />
            <Layout className={s.content}>
                {children}
                <AppFooter />
            </Layout>
        </S.Container>
    );
}

export function AnonymousLayout({ children, style }: Props) {
    return (
        <S.Container style={style}>
            <AppSidebar />
            <Layout className={s.content}>
                {children}
                <AppFooter />
            </Layout>
        </S.Container>
    );
}

/**
 * @deprecated
 */
export function BasePageHeader(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;
    console.warn('DEPRECATED: Do not use BasePageHeader component. It will be removed in future versions of the EMR.');
    console.warn('Use PageContainer or PageContainerHeader instead.');

    return (
        <S.PageWrapper>
            <div className={classNames(s.pageHeader, className)} {...rest} />
        </S.PageWrapper>
    );
}

/**
 * @deprecated
 */
export function BasePageContent(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;
    console.warn('DEPRECATED: Do not use BasePageContent component. It will be removed in future versions of the EMR.');
    console.warn('Use PageContainer or PageContainerContent instead.');

    return (
        <div className={s.pageContentWrapper}>
            <div className={classNames(s.pageContent, className)} {...rest} />
        </div>
    );
}
