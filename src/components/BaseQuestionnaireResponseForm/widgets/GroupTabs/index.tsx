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
    const groupContext = context[0]!;

    const { linkId } = questionItem;

    const formValues = useWatch();

    const item = getEnabledQuestions(questionItem.item ?? [], parentPath, formValues, groupContext);

    const tabItems = useMemo(() => item.filter((i) => !i.hidden), [item]);

    const tabsItems: Tab[] = useMemo(
        () =>
            tabItems.map((item) => {
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
            }),
        [groupContext, linkId, parentPath, tabItems],
    );

    return <Tabs type="card" items={tabsItems} />;
}
