import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { ReactNode } from 'react';

import { BaseHeader } from 'src/components/BaseHeader';

interface Props {
    children: ReactNode;
    bgHeight?: number;
    style?: React.CSSProperties;
}

export function BaseLayout({ children, bgHeight, style }: Props) {
    return (
        <Layout style={{ ...wrapperStyle, ...(style ?? {}) }}>
            {bgHeight ? (
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: '#E0EAFF',
                        width: '100%',
                        height: bgHeight,
                        top: 64,
                    }}
                />
            ) : null}
            <BaseHeader />

            <Layout style={layoutStyle}>
                <Content style={contentStyle}>{children}</Content>
            </Layout>
        </Layout>
    );
}

const wrapperStyle: any = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
};

const layoutStyle: any = { display: 'flex', height: '100%', flexDirection: 'row', width: 1080 };

const contentStyle: any = { width: '100%', backgroundColor: 'white' };
