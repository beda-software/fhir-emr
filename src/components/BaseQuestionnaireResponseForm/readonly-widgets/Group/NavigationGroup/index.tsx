import _ from 'lodash';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

import { GroupSidebarNavigation } from '../GroupSidebarNavigation';

export function NavigationGroup(props: GroupItemProps & { type?: 'row' | 'col' }) {
    const { parentPath, questionItem, context } = props;
    const { linkId, item, text } = questionItem;

    if (!item) {
        return null;
    }

    const isFirstNode = parentPath.length === 0;
    if (isFirstNode) {
        return <GroupSidebarNavigation {...props} />;
    }

    return (
        <div style={{ margin: '0 0 32px', ...(isFirstNode ? { padding: '0 0 0 32px' } : {}) }} id={`group-${linkId}`}>
            {text && <Paragraph style={{ fontSize: 18, fontWeight: 'bold', margin: '32px 0 8px' }}>{text}</Paragraph>}

            <QuestionItems questionItems={item} parentPath={[...parentPath, linkId, 'items']} context={context[0]!} />
        </div>
    );
}
