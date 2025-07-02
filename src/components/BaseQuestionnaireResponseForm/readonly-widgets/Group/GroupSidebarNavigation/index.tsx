import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import _ from 'lodash';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';
import { useTheme } from 'styled-components';

import { QuestionnaireSidebarNavigation } from 'src/components/QuestionnaireSidebarNavigation';
import { Paragraph } from 'src/components/Typography';

export function GroupSidebarNavigation(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;
    const { linkId, item, text } = questionItem;

    const theme = useTheme();

    if (!item) {
        return null;
    }

    return (
        <Layout style={{ padding: 0, borderRadius: '0 0 10px 10px' }} id={`group-${linkId}`}>
            <QuestionnaireSidebarNavigation {...props} />

            <Content
                style={{
                    padding: '0 24px',
                    borderRadius: '0 0 10px 0',
                    backgroundColor: theme.neutralPalette.gray_1,
                }}
            >
                {text && (
                    <Paragraph style={{ fontSize: 18, fontWeight: 'bold', margin: '32px 0 8px' }}>{text}</Paragraph>
                )}

                <QuestionItems
                    questionItems={item}
                    parentPath={[...parentPath, linkId, 'items']}
                    context={context[0]!}
                />
            </Content>
        </Layout>
    );
}
