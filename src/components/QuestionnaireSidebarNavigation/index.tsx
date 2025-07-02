import { Anchor, Card } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { GroupItemProps } from 'sdc-qrf';
import { useTheme } from 'styled-components';

import { useQuestionnaireSidebarNavigation } from './hooks';

export function QuestionnaireSidebarNavigation(props: GroupItemProps) {
    const { questionItem } = props;

    const { anchorItems } = useQuestionnaireSidebarNavigation(props);

    const theme = useTheme();

    if (!questionItem.item) {
        return null;
    }

    return (
        <Sider
            width={'240px'}
            style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                backgroundColor: theme.neutralPalette.gray_3,
                borderRadius: '0 0 0 10px',
                boxShadow: 'inset -8px 0 8px -8px rgba(0, 0, 0, 0.06)',
                margin: '0 0 0 -32px',
            }}
        >
            <Card
                style={{ backgroundColor: theme.neutralPalette.gray_3, border: 0, borderRadius: '0 0 0 10px' }}
                bodyStyle={{
                    boxShadow: 'inset -8px 0 8px -8px rgba(0, 0, 0, 0.06)',
                    borderRadius: '0 0 0 10px',
                }}
            >
                <Anchor affix={false} items={anchorItems} />
            </Card>
        </Sider>
    );
}
