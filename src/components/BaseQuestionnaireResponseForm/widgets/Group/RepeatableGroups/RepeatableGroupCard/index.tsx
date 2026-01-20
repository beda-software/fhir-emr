import { t } from '@lingui/macro';
import { useCallback } from 'react';
import { QuestionItems } from 'sdc-qrf';

import { useRepeatableGroup } from './hooks';
import { GroupMainCard, GroupSubCard } from '../../GroupCard';
import { RepeatableGroupProps } from '../types';

interface Props extends RepeatableGroupProps {
    variant?: 'main-card' | 'sub-card';
    onRemove?: () => void;
}

export function RepeatableGroupCard(props: Props) {
    const { index, groupItem, variant, onRemove: onRemoveProp } = props;
    const { questionItem } = groupItem;
    const { item, text, readOnly } = questionItem;

    const { onRemove, parentPath, context } = useRepeatableGroup(props);

    const handleRemove = useCallback(() => {
        onRemove();
        onRemoveProp?.();
    }, [onRemove, onRemoveProp]);

    const title = `${text || t`Item`} ${index + 1}`;

    if (variant === 'sub-card') {
        return (
            <GroupSubCard title={title} onRemove={handleRemove} readOnly={readOnly}>
                <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
            </GroupSubCard>
        );
    }

    return (
        <GroupMainCard title={title} onRemove={handleRemove} readOnly={readOnly}>
            <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
        </GroupMainCard>
    );
}
