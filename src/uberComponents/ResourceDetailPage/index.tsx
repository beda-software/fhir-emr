import { Bundle, FhirResource, ParametersParameter, Resource } from 'fhir/r4b';
import React, { useMemo } from 'react';
import { Route, Routes, useLocation, Link, useNavigate } from 'react-router-dom';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { extractBundleResources, WithId } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { RenderBundleResourceContext } from 'src/components/RenderBundleResourceContext';
import { Tabs } from 'src/components/Tabs';

import { DetailPageProps, PageTabsProps } from './types';
import { RecordType } from '../ResourceListPage/types';

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

function defaultToClinicalContext(resourceType: string, bundle: Bundle): ParametersParameter[] {
    const resources = (extractBundleResources(bundle) as Record<string, WithId<FhirResource>[]>)[resourceType] ?? [];
    const first = resources[0];
    if (!first) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                `[ResourceDetailPage] defaultToClinicalContext: no "${resourceType}" resource found in bundle. ` +
                    `Clinical context will be empty. Pass a custom toClinicalContext prop if the resource type differs.`,
            );
        }
        return [];
    }
    return [
        { name: resourceType, resource: first },
        { name: resourceType.toLowerCase(), resource: first },
    ];
}

type ResourceDetailPageContentProps<R extends Resource> = DetailPageProps<R> & {
    context: RecordType<WithId<R>>;
};

function ResourceDetailPageContent<R extends Resource>({
    context,
    getTitle,
    getTitleLeftElement,
    getTitleRightElement,
    tabs,
    maxWidth,
    toClinicalContext,
    resourceType,
}: ResourceDetailPageContentProps<R>) {
    const clinicalContextParams = useMemo(
        () =>
            toClinicalContext
                ? toClinicalContext(context.bundle)
                : defaultToClinicalContext(resourceType, context.bundle),
        [context.bundle, toClinicalContext, resourceType],
    );

    return (
        <ClinicalContext context={clinicalContextParams}>
            <PageContainer
                title={getTitle(context)}
                titleLeftElement={getTitleLeftElement ? getTitleLeftElement(context) : undefined}
                titleRightElement={getTitleRightElement ? getTitleRightElement(context) : undefined}
                layoutVariant="with-tabs"
                headerContent={<PageTabs tabs={tabs} />}
                maxWidth={maxWidth}
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
        </ClinicalContext>
    );
}

export function ResourceDetailPage<R extends Resource>(props: DetailPageProps<R>) {
    return (
        <RenderBundleResourceContext<R> {...props}>
            {(context) => <ResourceDetailPageContent context={context} {...props} />}
        </RenderBundleResourceContext>
    );
}
