import { Layout } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';

import s from './BaseLayout.module.scss';
import { AppFooter } from './Footer';
import { AppSidebar } from './Sidebar';

interface Props {
    children: ReactNode;
    style?: React.CSSProperties;
}

export function BaseLayout({ children, style }: Props) {
    return (
        <Layout className={s.container} style={style}>
            <AppSidebar />
            <Layout className={s.content}>
                {children}
                <AppFooter />
            </Layout>
        </Layout>
    );
}

export function BasePageHeader(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;

    return (
        <div className={s.pageHeaderWrapper}>
            <div className={classNames(s.pageHeader, className)} {...rest} />
        </div>
    );
}

export function BasePageContent(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;

    return (
        <div className={s.pageContentWrapper}>
            <div className={classNames(s.pageContent, className)} {...rest} />
        </div>
    );
}
