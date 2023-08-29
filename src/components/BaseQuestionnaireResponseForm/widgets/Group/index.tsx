import classNames from 'classnames';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Paragraph } from 'src/components/Typography';

import s from './group.module.scss';
import { RepeatableGroupRow, RepeatableGroups } from './RepeatableGroups';

function Flex(groupItem: GroupItemProps & { type?: 'row' | 'col' }) {
    const { parentPath, questionItem, context, type } = groupItem;
    const { linkId, item, repeats, text, helpText } = questionItem;

    if (repeats) {
        if (type === 'row') {
            return (
                <RepeatableGroups groupItem={groupItem} renderGroup={(props) => <RepeatableGroupRow {...props} />} />
            );
        }

        return <RepeatableGroups groupItem={groupItem} />;
    }

    return (
        <div className={s.group}>
            {text || helpText ? (
                <div>
                    {text && <Paragraph className={s.groupTitle}>{text}</Paragraph>}
                    {helpText && <Paragraph style={{ margin: 0 }}>{helpText}</Paragraph>}
                </div>
            ) : null}
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
