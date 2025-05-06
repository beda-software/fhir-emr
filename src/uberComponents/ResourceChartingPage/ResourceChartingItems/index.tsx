import { CaretUpOutlined } from '@ant-design/icons';
import { Collapse, List, Space, Typography } from 'antd';

import { selectCurrentUserRoleResource } from 'src/utils/role';

import { ResourceChartingItemsProps } from './types';
import { zipArrays } from './utils';
import { ChartingItemQuestionnaireAction } from '../../actions';

export function ResourceChartingItems(props: ResourceChartingItemsProps) {
    const author = selectCurrentUserRoleResource();
    const { resource, reload } = props;

    const items = props.data?.map((item, index) => {
        const itemsData = item.items !== undefined ? zipArrays<string>(item.items) : [];
        return {
            key: index,
            extra: item.actions !== undefined && (
                <Space>
                    {item?.actions.map((resourceAction, index) => (
                        <div
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {' '}
                            <ChartingItemQuestionnaireAction
                                key={index}
                                action={resourceAction}
                                reload={reload}
                                defaultLaunchContext={[
                                    { name: resource.resourceType, resource: resource },
                                    { name: 'Author', resource: author },
                                ]}
                            />
                        </div>
                    ))}
                </Space>
            ),
            label: <div style={{ fontWeight: 'bold' }}>{item.title}</div>,
            children: (
                <div style={{ marginLeft: '-15px' }}>
                    <List
                        dataSource={itemsData}
                        renderItem={(item) => (
                            <List.Item style={{ borderBottom: '0px', padding: '0px' }}>
                                <Space>
                                    {item.map((i, index) => (
                                        <Typography.Text key={index} strong={index === 0}>
                                            {i}
                                        </Typography.Text>
                                    ))}
                                </Space>
                            </List.Item>
                        )}
                    />
                </div>
            ),
        };
    });

    return (
        <Collapse
            items={items}
            bordered={false}
            style={{ backgroundColor: 'transparent', maxHeight: '500px', overflowY: 'auto' }}
            expandIcon={({ isActive }) => (
                <CaretUpOutlined
                    rotate={isActive ? 0 : 180}
                    style={{ fontSize: 14, color: '#555', marginLeft: -15, pointerEvents: 'none' }}
                />
            )}
        />
    );
}
