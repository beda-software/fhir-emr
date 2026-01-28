import { Tabs } from 'antd';
import type { Tab } from 'rc-tabs/lib/interface';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { FCEQuestionnaireItem, GroupItemProps, QuestionItems, getEnabledQuestions } from 'sdc-qrf';

type TabItem = Tab & {
    linkId: string;
    status: 'process' | 'error';
};

export function GroupTabs(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;

    if (questionItem.repeats) {
        console.warn('GroupWizard does not support repeatable groups in the first level');
    }
    const groupContext = context[0]!;

    const { linkId } = questionItem;

    const formValues = useWatch();

    const item = getEnabledQuestions(questionItem.item ?? [], parentPath, formValues, groupContext);

    const tabItems = useMemo(() => item.filter((i) => !i.hidden), [item]);

    const getTabItems = useCallback(
        (item: FCEQuestionnaireItem): TabItem => {
            return {
                key: item.linkId,
                label: item.text,
                status: 'error',
                linkId: item.linkId,
                children: (
                    <QuestionItems
                        questionItems={item.item!}
                        parentPath={[...parentPath, linkId, 'items', item.linkId, 'items']}
                        context={groupContext}
                    />
                ),
            };
        },
        [parentPath, linkId, groupContext],
    );

    const tabsItems: TabItem[] = useMemo(() => tabItems.map((item) => getTabItems(item)), [getTabItems, tabItems]);

    return <Tabs type="card" items={tabsItems} />;
}
