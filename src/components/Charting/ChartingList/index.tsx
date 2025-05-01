import { Avatar, Col, List, ListProps, Row } from 'antd';
import { useTheme } from 'styled-components';

import { Link } from 'src/components';

import { S } from './styles';

type ChartingListItem = {
    icon: React.ReactNode;
    title: string;
    path: string;
};
interface ChartingListProps extends Pick<ListProps<ChartingListItem>, 'dataSource'> {
    title?: string;
}

export function ChartingList(props: ChartingListProps) {
    const { title, dataSource } = props;

    const theme = useTheme();

    return (
        <Col style={S.container}>
            {title && <Row style={S.title}>{title}</Row>}

            <Row>
                <List<ChartingListItem>
                    split={false}
                    itemLayout="horizontal"
                    dataSource={dataSource}
                    style={{ width: '100%' }}
                    rowKey={(item) => item.path}
                    renderItem={(item) => (
                        <List.Item style={S.listItem}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        size={24}
                                        icon={item.icon}
                                        style={{ backgroundColor: theme.primaryPalette.bcp_1, color: theme.primary }}
                                    />
                                }
                                title={
                                    <Link href={item.path} style={S.listItemLink}>
                                        {item.title}
                                    </Link>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Row>
        </Col>
    );
}
