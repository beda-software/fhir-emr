import { Bundle, Resource } from 'fhir/r4b';
import React from 'react';
import { useParams, Route, Routes, useLocation, Link, useNavigate } from 'react-router-dom';

import { RenderRemoteData, useService, WithId } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { Tabs } from 'src/components/Tabs';
import { getFHIRResources } from 'src/services';
import { compileAsFirst } from 'src/utils';

import { DetailPageProps, PageTabsProps } from './types';
import { RecordType } from '../ResourceListPage/types';
export type { Tab } from './types';

export function PageTabs<R extends Resource>({ tabs }: PageTabsProps<R>) {
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

export function ResourceDetailPage<R extends Resource>({
    resourceType,
    getSearchParams,
    getTitle,
    tabs,
    extractPrimaryResource,
}: DetailPageProps<R>) {
    const params = useParams();
    const [response] = useService(() => getFHIRResources(resourceType, getSearchParams(params)));
    const defaultExtractPrimaryResource = compileAsFirst<Bundle<WithId<R>>, R>(
        'Bundle.entry.resource.where(resourceType=%resourceType).first()',
    );
    return (
        <RenderRemoteData remoteData={response}>
            {(bundle) => {
                let resource: R | undefined = undefined;
                if (extractPrimaryResource) {
                    resource = extractPrimaryResource(bundle);
                } else {
                    resource = defaultExtractPrimaryResource(bundle, { resourceType });
                }
                if (typeof resource === 'undefined') {
                    return <p>NASTY ERROR</p>;
                }
                const context: RecordType<R> = { resource, bundle: bundle as Bundle };
                return (
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
                );
            }}
        </RenderRemoteData>
    );
}
