import { ResourceChartingHeaderProps, ResourceWithId } from '../types';

import { Typography, Space, List } from 'antd';

import { HeaderQuestionnaireAction } from '../../actions';

/* TODO:
 * 2. Add reload
 * 3. Provide correct functionality of the edit button */

export function ResourceChartingHeader<R extends ResourceWithId>(props: ResourceChartingHeaderProps<R>) {
    const { title, preparedAttributes, resourceActions, reload, resource } = props;

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
                    reload={reload}
                    defaultLaunchContext={[
                        { name: resource.resourceType, resource: resource }
                    ]}
                    buttonType="link"
                />)}
            </Space>}
        </div>
    )
}
