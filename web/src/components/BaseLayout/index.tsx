import { Layout } from 'antd';
import { ReactNode } from 'react';

import s from './BaseLayout.module.scss';
import { AppFooter } from './Footer';
import { AppHeader } from './Header';

interface Props {
    children: ReactNode;
    style?: React.CSSProperties;
}

export function BaseLayout({ children, style }: Props) {
    return (
        <Layout className={s.container} style={style}>
            <AppHeader />
            {children}
            <AppFooter />
        </Layout>
    );
}

export function BasePageHeader(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={s.pageHeaderWrapper}>
            <div className={s.pageHeader} {...props} />
        </div>
    );
}

export function BasePageContent(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={s.pageContentWrapper}>
            <div className={s.pageContent} {...props} />
        </div>
    );
}
