import { CaretUpOutlined } from '@ant-design/icons';
import { Collapse, List, Space, Typography } from 'antd';

import { selectCurrentUserRoleResource } from 'src/utils/role';

import s from './ResourceChartingItems.module.scss';
import { ResourceChartingItemsProps } from './types';
import { zipArrays } from './utils';
import { ChartingItemQuestionnaireAction } from '../../actions';

export function ResourceChartingItems(props: ResourceChartingItemsProps) {
    const author = selectCurrentUserRoleResource();
    const { resource, reload } = props;

    const items = props.data?.map((item, index) => {
        const itemsData = item.items !== undefined ? zipArrays<string>(item.items) : [];
        const dataSource = item.itemsCount ? itemsData.slice(0, item.itemsCount) : itemsData;

        return {
            key: `${item.title}-${index}`,
            /* collapsible: 'disabled', */
            extra: item.actions !== undefined && (
                <Space>
                    {item?.actions.map((resourceAction, actionIndex) => (
                        <span key={`action-${actionIndex}`} className={s.actionWrapper}>
                            <ChartingItemQuestionnaireAction
                                action={resourceAction}
                                reload={reload}
                                defaultLaunchContext={[
                                    { name: resource.resourceType, resource: resource },
                                    { name: 'Author', resource: author },
                                ]}
                            />
                        </span>
                    ))}
                </Space>
            ),
            label: <div className={s.itemTitle}>{item.title}</div>,
            children: (
                <div className={s.itemContent}>
                    <List
                        dataSource={dataSource}
                        renderItem={(item) => (
                            <List.Item style={{ borderBottom: '0px', padding: '0px' }}>
                                <Space>
                                    {item.map((i, iIndex) => (
                                        <Typography.Text key={iIndex} strong={iIndex === 0}>
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
            className={s.collapseWrapper}
            expandIcon={({ isActive }) => <CaretUpOutlined rotate={isActive ? 0 : 180} className={s.collapseIcon} />}
        />
    );
}
