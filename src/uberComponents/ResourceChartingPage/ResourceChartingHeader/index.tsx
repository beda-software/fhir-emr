import { Typography, Space, List } from 'antd';

import { ChartingHeaderQuestionnaireAction } from '../../actions';
import { ResourceChartingHeaderProps, ResourceWithId } from '../types';

export function ResourceChartingHeader<R extends ResourceWithId>(props: ResourceChartingHeaderProps<R>) {
    const { title, preparedAttributes, resourceActions, reload, resource } = props;

    return (
        <div>
            <Typography.Title level={3}>{title}</Typography.Title>
            <List
                style={{ marginTop: '16px' }}
                dataSource={preparedAttributes}
                renderItem={(item) => (
                    <List.Item style={{ borderBottom: '0px', marginBottom: '8px', padding: '0px' }} key={item.key}>
                        <Space>
                            {item.icon}
                            <Typography.Text>{item.data}</Typography.Text>
                        </Space>
                    </List.Item>
                )}
            />
            {resourceActions !== undefined && (
                <Space style={{ marginLeft: '-15px' }}>
                    {resourceActions.map((resourceAction, index) => (
                        <ChartingHeaderQuestionnaireAction
                            key={index}
                            action={resourceAction}
                            reload={reload}
                            defaultLaunchContext={[{ name: resource.resourceType, resource: resource }]}
                        />
                    ))}
                </Space>
            )}
        </div>
    );
}
