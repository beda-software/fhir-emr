import { ResourceChartingPageProps } from './types';
import { Resource, FhirResource } from 'fhir/r4b';
import { Charting } from 'src/components/Charting';

import { WithId } from '@beda.software/fhir-react';

import { Route, Routes } from 'react-router-dom';

import { useResourceChartingPage } from './hooks';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { ResourceChartingHeader } from './ResourceChartingHeader';
import { ResourceChartingItems } from './ResourceChartingItems';
import { ResourceChartingFooter } from './ResourceChartingFooter';
import { Divider } from 'antd';

export function ResourceChartingPage<R extends WithId<Resource>>(props: ResourceChartingPageProps<R>) {
    const { response, reload } = useResourceChartingPage(props);

    return (
        <RenderRemoteData remoteData={response}>
            {(data) => {
                return (
                    <Charting<R>
                        headerContent={<>HEADER CONTENT</>}
                        resourceType={props.resourceType}
                        chartingContent={
                            <div style={{ padding: '24px 16px 24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                <div>
                                    <ResourceChartingHeader
                                        resource={data.resource as FhirResource}
                                        title={data.title!}
                                        preparedAttributes={data.attributes}
                                        resourceActions={props.resourceActions}
                                        reload={reload}
                                    />
                                    <Divider style={{ padding: 0, marginBottom: 0, marginTop: 24 }} />
                                    <ResourceChartingItems
                                        resource={data.resource as FhirResource}
                                        reload={reload}
                                        data={data.chartedItems}
                                    />
                                </div>
                                <ResourceChartingFooter
                                    resource={data.resource as FhirResource}
                                    reload={reload}
                                    actions={props.footerActions}
                                />
                            </div>
                        }
                        getSearchParams={() => (props.searchParams ?? {})}
                        getTitle={() => data.title!}
                        titleRightElement={<>"TITLE RIGHT ELEMENT"</>}
                        maxWidth={'100%'}
                        layoutVariant="with-tabs"
                    >
                        <Routes>
                            <Route
                                path="clinical-documents/*"
                                element={
                                    <Routes>
                                    </Routes>
                                }
                            />
                        </Routes>
                    </Charting>
                );
            }}
        </RenderRemoteData>
    );
}
