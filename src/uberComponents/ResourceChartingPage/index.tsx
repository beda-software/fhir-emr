import { ResourceChartingPageProps } from './types';
import { Resource, FhirResource } from 'fhir/r4b';
import { Charting } from 'src/components/Charting';

import { WithId } from '@beda.software/fhir-react';

import { Route, Routes } from 'react-router-dom';

import { useResourceChartingPage } from './hooks';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { ResourceChartingHeader } from './ResourceChartingHeader';

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
                            <div style={{ padding: '24px 16px 24px 16px' }}>
                                <ResourceChartingHeader
                                    resource={data.resource as FhirResource}
                                    title={data.title!}
                                    preparedAttributes={data.attributes}
                                    resourceActions={props.resourceActions}
                                    reload={reload}
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
