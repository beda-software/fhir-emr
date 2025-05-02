import { ResourceChartingPageProps, ResourceChartingHeaderProps } from './types';
import { Resource } from 'fhir/r4b';
import { Charting } from 'src/components/Charting';

import { WithId } from '@beda.software/fhir-react';

import { Route, Routes } from 'react-router-dom';

import { useResourceChartingPage } from './hooks';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { List, Typography, Space } from 'antd';



function ResourceChartingHeader(props: ResourceChartingHeaderProps) {
    const { title, preparedAttributes } = props;
    return (
        <div>

            <Typography.Title level={3}>{title}</Typography.Title>
            <List
                dataSource={preparedAttributes}
                renderItem={(item) => (
                    <List.Item>
                        <Space>
                            {item.icon}
                            <Typography.Text>{item.data}</Typography.Text>
                        </Space>
                    </List.Item>
                )}
            />
        </div>
    )
}

export function ResourceChartingPage<R extends WithId<Resource>>(props: ResourceChartingPageProps<R>) {
    const { response } = useResourceChartingPage(props);

    return (
        <RenderRemoteData remoteData={response}>
            {(data) => {
                console.log('data', data)
                return (
                    <Charting<R>
                        headerContent={<>HEADER CONTENT</>}
                        resourceType={props.resourceType}
                        chartingContent={
                            <ResourceChartingHeader
                                title={data.title!}
                                preparedAttributes={data.attributes}
                            />
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
