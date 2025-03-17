import _ from 'lodash';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

import { RepeatableGroups } from './RepeatableGroups';
import { GroupSidebarNavigation } from './GroupSidebarNavigation';

function Flex(props: GroupItemProps & { type?: 'row' | 'col' }) {
    const { parentPath, questionItem, context } = props;
    const { linkId, item, repeats, text } = questionItem;

    if (!item) {
        return null;
    }

    if (repeats === true) {
        return <RepeatableGroups {...props} />;
    }

    const isFirstNode = parentPath.length === 0;
    if (isFirstNode) {
        const navigationReadonlyItemControl = questionItem.readOnlyItemControl?.coding?.find(
            (coding) => coding.code === 'navigation-group',
        );

        if (navigationReadonlyItemControl) {
            return <GroupSidebarNavigation {...props} />;
        }
    }

    return (
        <div style={{ margin: '0 0 32px', ...(isFirstNode ? { padding: '0 0 0 32px' } : {}) }} id={`group-${linkId}`}>
            {text && <Paragraph style={{ fontSize: 18, fontWeight: 'bold', margin: '32px 0 8px' }}>{text}</Paragraph>}

            <QuestionItems questionItems={item} parentPath={[...parentPath, linkId, 'items']} context={context[0]!} />
        </div>
    );
}

export function Group(props: GroupItemProps) {
    return <Flex {...props} />;
}

export function Col(props: GroupItemProps) {
    return <Flex {...props} type="col" />;
}

export function Row(props: GroupItemProps) {
    return <Flex {...props} type="row" />;
}
