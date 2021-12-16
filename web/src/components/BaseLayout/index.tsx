import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { ReactNode } from 'react';

import { BaseHeader } from 'src/components/BaseHeader';
import { BaseSider } from 'src/components/BaseSider';

interface Props {
    children: ReactNode;
}

export function BaseLayout({ children }: Props) {
    return (
        <Layout style={wrapperStyle}>
            <BaseHeader />
            <Layout style={layoutStyle}>
                <BaseSider />
                <Content style={contentStyle}>{children}</Content>
            </Layout>
        </Layout>
    );
}

const wrapperStyle = { height: '100vh' };

const layoutStyle = { display: 'flex', height: '100%' };

const contentStyle = { backgroundColor: 'yellow', width: '100%' };
