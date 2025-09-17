import { Resource } from 'fhir/r4b';
import React from 'react';
import { Route, Routes, useLocation, Link, useNavigate } from 'react-router-dom';

import { PageContainer } from 'src/components';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { RenderBundleResourceContext } from 'src/components/RenderBundleResourceContext';
import { Tabs } from 'src/components/Tabs';

import { DetailPageProps, PageTabsProps } from './types';
export type { Tab } from './types';

export function PageTabs<R extends Resource, Extra = unknown>({ tabs }: PageTabsProps<R, Extra>) {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems: RouteItem[] = tabs.map(({ label, path }) => ({
        label,
        path: `${path}`,
    }));

    const parts = location.pathname?.split('/');
    let activeKey: string = parts[parts.length - 1]!;
    if (tabs.map((t) => t.path).indexOf(activeKey) === -1) {
        activeKey = '';
    }

    if (activeKey === '') {
        for (const part of parts) {
            for (const item of menuItems) {
                if (item.path !== '') {
                    if (part === item.path) {
                        activeKey = part;
                    }
                }
            }
        }
    }

    return (
        <Tabs
            type="card"
            boxShadow={false}
            activeKey={activeKey}
            items={menuItems.map((route) => ({
                key: route.path,
                label: <Link to={route.path}>{route.label}</Link>,
            }))}
            onTabClick={(path) => navigate(path)}
        />
    );
}

export function ResourceDetailPage<R extends Resource>(props: DetailPageProps<R>) {
    const { getTitle, tabs } = props;

    return (
        <RenderBundleResourceContext<R> {...props}>
            {(context) => (
                <PageContainer
                    title={getTitle(context)}
                    layoutVariant="with-tabs"
                    headerContent={<PageTabs tabs={tabs} />}
                >
                    <Routes>
                        {tabs.map(({ path, component }) => (
                            <React.Fragment key={path}>
                                <Route path={'/' + path} element={component(context)} />
                                <Route path={'/' + path + '/*'} element={component(context)} />
                            </React.Fragment>
                        ))}
                    </Routes>
                </PageContainer>
            )}
        </RenderBundleResourceContext>
    );
}
