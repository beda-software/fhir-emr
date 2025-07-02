import classNames from 'classnames';
import _ from 'lodash';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Text, Title } from 'src/components/Typography';

import { GroupContext, GroupContextProps } from './context';
import { GridGroup } from './GridGroup';
import s from './group.module.scss';
import { GroupCard } from './GroupCard';
import { GTable } from './GTable';
import { RepeatableGroupRow, RepeatableGroups } from './RepeatableGroups';
import { S } from './styles';

function Flex(props: GroupItemProps & { type?: GroupContextProps['type'] }) {
    const { parentPath, questionItem, context, type = 'col' } = props;
    const { linkId, item, repeats, text, helpText, hidden } = questionItem;

    if (hidden) {
        return null;
    }

    const renderRepeatableGroup = () => {
        if (type === 'gtable') {
            return <GTable groupItem={props} />;
        }

        if (type === 'row') {
            return <RepeatableGroups groupItem={props} renderGroup={(p) => <RepeatableGroupRow {...p} />} />;
        }

        return <RepeatableGroups groupItem={props} />;
    };

    if (type === 'grid') {
        return <GridGroup groupItem={props} />;
    }

    if (repeats) {
        return <GroupContext.Provider value={{ type }}>{renderRepeatableGroup()}</GroupContext.Provider>;
    }

    const isSection = type === 'section' || type === 'section-with-divider';

    return (
        <S.Group>
            {text || helpText ? (
                <S.Header $type={type}>
                    {text && <Title level={isSection ? 4 : 5}>{text}</Title>}
                    {helpText && <Text>{helpText}</Text>}
                </S.Header>
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
        </S.Group>
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

export function Gtable(props: GroupItemProps) {
    return <Flex {...props} type="gtable" />;
}

export function Grid(props: GroupItemProps) {
    return <Flex {...props} type="grid" />;
}

export function Section(props: GroupItemProps) {
    return <Flex {...props} type="section" />;
}

export function SectionWithDivider(props: GroupItemProps) {
    return <Flex {...props} type="section-with-divider" />;
}

export function MainCard(props: GroupItemProps) {
    return <GroupCard {...props} variant="main-card" />;
}

export function SubCard(props: GroupItemProps) {
    return <GroupCard {...props} variant="sub-card" />;
}
