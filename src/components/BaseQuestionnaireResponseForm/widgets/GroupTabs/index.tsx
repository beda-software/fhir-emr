import { Tabs } from 'antd';
import type { Tab } from 'rc-tabs/lib/interface';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { GroupItemProps, QuestionItems, getEnabledQuestions } from 'sdc-qrf';

export function GroupTabs(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;

    if (questionItem.repeats) {
        console.warn('GroupTabs does not support repeatable groups in the first level');
    }

    const formValues = useWatch();

    const tabsItems: Tab[] = useMemo(() => {
        const { linkId } = questionItem;

        const groupContext = context[0];
        if (!groupContext) {
            return [];
        }

        const item = getEnabledQuestions(questionItem.item ?? [], parentPath, formValues, groupContext);

        return item
            .filter((i) => !i.hidden)
            .map((item) => {
                return {
                    key: item.linkId,
                    label: item.text,
                    children: (
                        <QuestionItems
                            questionItems={item.item!}
                            parentPath={[...parentPath, linkId, 'items', item.linkId, 'items']}
                            context={groupContext}
                        />
                    ),
                };
            });
    }, [context, formValues, parentPath, questionItem]);

    return <Tabs type="card" items={tabsItems} />;
}
