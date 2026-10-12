import { Typography, Space, List } from 'antd';

import s from './ResourceChartingHeader.module.scss';
import { ChartingHeaderQuestionnaireAction } from '../../actions';
import { ResourceChartingHeaderProps } from '../types';

export function ResourceChartingHeader(props: ResourceChartingHeaderProps) {
    const { title, preparedAttributes, resourceActions, reload, resource } = props;
    return (
        <div>
            <Typography.Title level={3}>{title}</Typography.Title>
            <List
                className={s.chartingHeaderList}
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
                <Space className={s.chartingHeaderActionsSpace}>
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
