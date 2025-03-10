import { DeleteOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button } from 'antd';
import React from 'react';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Title } from 'src/components/Typography';

import { S } from './styles';
import { RepeatableGroupCard, RepeatableGroups } from '../RepeatableGroups';

interface GroupCardProps extends GroupItemProps {
    variant?: 'main-card' | 'sub-card';
}

export function GroupCard(props: GroupCardProps) {
    const { parentPath, questionItem, context, variant = 'main-card' } = props;
    const { linkId, item, repeats, text, hidden } = questionItem;

    if (hidden) {
        return null;
    }

    const renderCardContent = () => {
        return (
            item && (
                <QuestionItems
                    questionItems={item}
                    parentPath={[...parentPath, linkId, 'items']}
                    context={context[0]!}
                />
            )
        );
    };

    // TODO: display helpText

    if (repeats) {
        if (variant === 'sub-card') {
            return (
                <RepeatableGroups
                    groupItem={props}
                    renderGroup={(p) => <RepeatableGroupCard {...p} variant="sub-card" />}
                />
            );
        }

        return <RepeatableGroups groupItem={props} />;
    }

    if (variant === 'sub-card') {
        return <GroupSubCard title={text}>{renderCardContent()}</GroupSubCard>;
    }

    return <GroupMainCard title={text}>{renderCardContent()}</GroupMainCard>;
}

interface CardProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    onRemove?: () => void;
    readOnly?: boolean;
}

export function GroupMainCard(props: CardProps) {
    const { title = t`Group`, children, readOnly, onRemove: initialOnRemove } = props;

    const onRemove = readOnly ? undefined : initialOnRemove;

    return (
        <S.Card
            title={<Title level={4}>{title}</Title>}
            $variant={'main-card'}
            extra={
                onRemove ? (
                    <Button
                        type="default"
                        onClick={onRemove}
                        size="middle"
                        icon={<DeleteOutlined />}
                        data-testid="remove-group-button"
                    >
                        <span>
                            <Trans>Remove</Trans>
                        </span>
                    </Button>
                ) : null
            }
        >
            <S.GroupContent>{children}</S.GroupContent>
        </S.Card>
    );
}

export function GroupSubCard(props: CardProps) {
    const { title = t`Group`, children, readOnly, onRemove: initialOnRemove } = props;

    const onRemove = readOnly ? undefined : initialOnRemove;

    return (
        <S.Card
            title={<Title level={5}>{title}</Title>}
            $variant={'sub-card'}
            extra={
                onRemove ? <Button icon={<DeleteOutlined />} type="default" onClick={onRemove} size="middle" /> : null
            }
        >
            <S.GroupContent>{children}</S.GroupContent>
        </S.Card>
    );
}
