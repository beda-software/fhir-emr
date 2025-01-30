import { t } from '@lingui/macro';
import { QuestionItems } from 'sdc-qrf';

import { useRepeatableGroup, type RepeatableGroupProps } from '.';
import { GroupMainCard, GroupSubCard } from '../GroupCard';

interface Props extends RepeatableGroupProps {
    variant?: 'main-card' | 'sub-card';
}

export function RepeatableGroupCard(props: Props) {
    const { index, groupItem, variant } = props;
    const { questionItem } = groupItem;
    const { item, text, readOnly } = questionItem;
    const { onRemove, parentPath, context } = useRepeatableGroup(props);

    const getTitle = () => {
        if (text) {
            return `${text} ${index + 1}`;
        }

        return t`Item ${index + 1}`;
    };

    if (variant === 'sub-card') {
        return (
            <GroupSubCard title={getTitle()} onRemove={onRemove} readOnly={readOnly}>
                <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
            </GroupSubCard>
        );
    }

    return (
        <GroupMainCard title={getTitle()} onRemove={onRemove} readOnly={readOnly}>
            <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
        </GroupMainCard>
    );
}
