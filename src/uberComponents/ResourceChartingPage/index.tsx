import { Resource, FhirResource } from 'fhir/r4b';
import { Route, Routes } from 'react-router-dom';

import { WithId, RenderRemoteData } from '@beda.software/fhir-react';

import { Charting } from 'src/components/Charting';

import { useResourceChartingPage } from './hooks';
import { ResourceChartingContent } from './ResourceChartingContent';
import { ResourceChartingPageProps } from './types';

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
                            <ResourceChartingContent<R>
                                reload={reload}
                                title={data.title}
                                resource={data.resource as FhirResource}
                                attributes={data.attributes}
                                resourceActions={props.resourceActions}
                                chartedItems={data.chartedItems}
                                footerActions={props.footerActions}
                            />
                        }
                        getSearchParams={() => props.searchParams ?? {}}
                        getTitle={() => data.title!}
                        titleRightElement={<>TITLE RIGHT ELEMENT</>}
                        maxWidth={'100%'}
                        layoutVariant="with-tabs"
                    >
                        <Routes>
                            <Route path="clinical-documents/*" element={<Routes></Routes>} />
                        </Routes>
                    </Charting>
                );
            }}
        </RenderRemoteData>
    );
}
