import { Bundle, Resource } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { useParams, Route, Routes, useLocation, Link, useNavigate, Params } from 'react-router-dom';

import { SearchParams, RenderRemoteData, useService, WithId } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { Tabs } from 'src/components/Tabs';
import { getFHIRResources } from 'src/services';
import { compileAsFirst } from 'src/utils';

interface DetailContext<R extends Resource> {
    resource: R;
    bundle: Bundle<R>;
}

export interface Tab<R extends Resource> {
    label: string;
    path?: string;
    component: (context: DetailContext<R>) => JSX.Element;
}

interface DetailPageProps<R extends Resource> {
    resourceType: R['resourceType'];
    getSearchParams: (params: Readonly<Params<string>>) => SearchParams;
    getTitle: (context: DetailContext<R>) => string;
    tabs: Array<Tab<R>>;
    basePath: string;
    extractPrimaryResource?: (bundle: Bundle<R>) => R;
}

interface PageTabsProps<R extends Resource> {
    tabs: Array<Tab<R>>;
    basePath: string;
}

export function PageTabs<R extends Resource>({ tabs, basePath }: PageTabsProps<R>) {
    const location = useLocation();
    const params = useParams<{ id: string }>();
    const navigate = useNavigate();

    const menuItems: RouteItem[] = tabs.map(({ label, path }) => ({
        label,
        path: `/${basePath}/${params.id}/${path}`,
    }));

    const [currentPath, setCurrentPath] = useState(location?.pathname);

    useEffect(() => {
        setCurrentPath(location?.pathname);
    }, [location]);

    return (
        <Tabs
            boxShadow={false}
            activeKey={currentPath.split('/').slice(0, 4).join('/')}
            items={menuItems.map((route) => ({
                key: route.path,
                label: <Link to={route.path}>{route.label}</Link>,
            }))}
            onTabClick={(path) => navigate(path)}
        />
    );
}

export function DetailPage<R extends Resource>({
    resourceType,
    getSearchParams,
    getTitle,
    tabs,
    basePath,
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
                const context: DetailContext<R> = { resource, bundle };
                return (
                    <PageContainer
                        title={getTitle(context)}
                        layoutVariant="with-tabs"
                        headerContent={<PageTabs tabs={tabs} basePath={basePath} />}
                    >
                        <Routes>
                            {tabs.map(({ path, component }) => (
                                <Route path={'/' + path} element={component(context)} key={path} />
                            ))}
                        </Routes>
                    </PageContainer>
                );
            }}
        </RenderRemoteData>
    );
}
