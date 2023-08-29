import classNames from 'classnames';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import s from './group.module.scss';
import { RepeatableGroupRow, RepeatableGroups } from './RepeatableGroups';

function Flex(groupItem: GroupItemProps & { type?: 'row' | 'col' }) {
    const { parentPath, questionItem, context, type } = groupItem;
    const { linkId, item, repeats } = questionItem;

    if (!item) {
        return null;
    }

    if (repeats) {
        if (type === 'row') {
            return (
                <RepeatableGroups groupItem={groupItem} renderGroup={(props) => <RepeatableGroupRow {...props} />} />
            );
        }

        return <RepeatableGroups groupItem={groupItem} />;
    }

    return (
        <>
            {item && (
                <div
                    className={classNames({
                        [s.row as string]: type === 'row',
                        [s.col as string]: !type || type === 'col',
                    })}
                >
                    <QuestionItems
                        questionItems={item}
                        parentPath={[...parentPath, linkId, 'items']}
                        context={context[0]!}
                    />
                </div>
            )}
        </>
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
