import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import { FCEQuestionnaireItem, GroupItemProps, QuestionItems } from 'sdc-qrf';

import {
    getGroupStats,
    GroupStats,
    GroupWizardBus,
} from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupWizard';
import { Text, Title } from 'src/components/Typography';
import { Wizard, WizardItem, WizardProps } from 'src/components/Wizard';

import { S } from './styles';

interface GroupWizardProps extends GroupItemProps {
    wizard?: Partial<WizardProps>;
}

export function GroupWizardVertical(props: GroupWizardProps) {
    return (
        <GroupWizard
            {...props}
            wizard={{
                direction: 'vertical',
                size: 'small',
            }}
        />
    );
}

export function GroupWizard(props: GroupWizardProps) {
    const { parentPath, questionItem, context, wizard } = props;

    const [currentIndex, setCurrentIndex] = useState(0);
    const { item = [], linkId } = questionItem;

    const formValues = useWatch();

    const showDescription = wizard?.direction === 'vertical';

    const getGroupStatus = (groupStats: GroupStats): 'wait' | 'process' | 'finish' | 'error' => {
        if (groupStats.finishedQuestions === 0) {
            return 'wait';
        }

        if (groupStats.finishedRequiredQuestions >= groupStats.totalRequiredQuestions) {
            return 'finish';
        }

        return 'process';
    };

    const getStepItem = (item: FCEQuestionnaireItem) => {
        const groupStats = getGroupStats(item, [...parentPath, linkId], formValues, context);
        const description = showDescription
            ? `${groupStats.finishedQuestions} of ${groupStats.totalQuestions}`
            : undefined;

        return {
            title: item.text,
            linkId: item.linkId,
            status: getGroupStatus(groupStats),
            description,
        };
    };

    const stepsItems: WizardItem[] = item.map((qItem) => getStepItem(qItem));

    const onStepChange = (value: number) => {
        setCurrentIndex(value);
    };

    GroupWizardBus.useBus(
        'scrollTo',
        ({ groupLinkId }) => {
            const valueIndex = stepsItems.findIndex((step) => step.linkId === groupLinkId);
            onStepChange(valueIndex);
        },
        [],
    );

    if (parentPath.length !== 0) {
        console.error('The wizard item control must be in root group');

        return <Text>The wizard item control must be in root group</Text>;
    }

    if (item.some((i) => i.type !== 'group')) {
        console.error('The wizard item control must contain only group items');

        return <Text>The wizard item control must contain only group items</Text>;
    }

    return (
        <Wizard items={stepsItems} currentIndex={currentIndex} onChange={onStepChange} {...props.wizard}>
            {item.map((groupItem, index) => {
                if (index !== currentIndex) {
                    return null;
                }

                return (
                    <S.Group $active={index === currentIndex} key={`group-item-${groupItem.linkId}`}>
                        {groupItem.text && wizard?.direction === 'vertical' ? (
                            <Title level={4} style={{ fontWeight: 700 }}>
                                {groupItem.text}
                            </Title>
                        ) : null}
                        <QuestionItems
                            questionItems={groupItem.item!}
                            parentPath={[...parentPath, linkId, 'items', groupItem.linkId, 'items']}
                            context={context[0]!}
                        />
                    </S.Group>
                );
            })}
        </Wizard>
    );
}
