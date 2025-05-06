import { ResourceChartingPageProps, ResourceChartingHeaderProps } from './types';
import { Resource } from 'fhir/r4b';
import { Charting } from 'src/components/Charting';

import { WithId } from '@beda.software/fhir-react';

import { Route, Routes } from 'react-router-dom';

import { useResourceChartingPage } from './hooks';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { List, Typography, Space } from 'antd';

import { HeaderQuestionnaireAction } from '../actions';



function ResourceChartingHeader(props: ResourceChartingHeaderProps) {
    const { title, preparedAttributes, resourceActions } = props;

    return (
        <div>
            <Typography.Title level={3}>{title}</Typography.Title>
            <List
                style={{ marginTop: '16px' }}
                dataSource={preparedAttributes}
                renderItem={(item) => (
                    <List.Item style={{ borderBottom: '0px', marginBottom: '8px', padding: '0px' }}>
                        <Space>
                            {item.icon}
                            <Typography.Text>{item.data}</Typography.Text>
                        </Space>
                    </List.Item>
                )}
            />
            {resourceActions !== undefined && <Space style={{ marginLeft: '-15px' }}>
                {resourceActions.map((resourceAction) => <HeaderQuestionnaireAction
                    action={resourceAction}
                    reload={() => console.log('TODO')}
                    defaultLaunchContext={[]}
                    buttonType="link"
                />)}
            </Space>}

        </div>
    )
}

export function ResourceChartingPage<R extends WithId<Resource>>(props: ResourceChartingPageProps<R>) {
    const { response } = useResourceChartingPage(props);

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
                                    title={data.title!}
                                    preparedAttributes={data.attributes}
                                    resourceActions={props.resourceActions}
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
