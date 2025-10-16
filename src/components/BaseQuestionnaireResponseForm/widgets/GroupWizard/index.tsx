import _ from 'lodash';
import { useContext, useMemo, useState } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import {
    FCEQuestionnaireItem,
    FormItems,
    getEnabledQuestions,
    GroupItemProps,
    ItemContext,
    QuestionItems,
    FormAnswerItems,
    cleanFormAnswerItems,
} from 'sdc-qrf';

import { createBus } from '@beda.software/fhir-react';

import { Text, Title } from 'src/components/Typography';
import { Wizard, WizardItem, WizardProps } from 'src/components/Wizard';
import { questionnaireItemsToValidationSchema } from 'src/utils';

import { S } from './styles';
import { BaseQuestionnaireResponseFormPropsContext } from '../../context';

interface GroupWizardProps extends GroupItemProps {
    wizard?: Partial<WizardProps>;
}

export const GroupWizardBus = createBus<{
    type: 'scrollTo';
    groupLinkId: string;
}>();

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

export function GroupWizardWithTooltips(props: GroupWizardProps) {
    return (
        <GroupWizard
            {...props}
            wizard={{
                labelPlacement: 'tooltip',
            }}
        />
    );
}

export interface GroupStats {
    totalQuestions: number;
    finishedQuestions: number;
    totalRequiredQuestions: number;
    finishedRequiredQuestions: number;
}

export function GroupWizard(props: GroupWizardProps) {
    const { parentPath, questionItem, context, wizard } = props;
    const baseQRFPropsContext = useContext(BaseQuestionnaireResponseFormPropsContext);

    const [currentIndex, setCurrentIndex] = useState(0);
    const { linkId } = questionItem;

    const formValues = useWatch();

    const { isSubmitted } = useFormState();

    const wizardItems = useMemo(() => (questionItem.item ?? []).filter((i) => !i.hidden), [questionItem.item]);
    const hiddenItems = useMemo(() => (questionItem.item ?? []).filter((i) => i.hidden), [questionItem.item]);

    const itemsCount = wizardItems.length;
    const isLastStepActive = itemsCount === currentIndex + 1;

    const showDescription = wizard?.direction === 'vertical';

    const getGroupStatus = (
        item: FCEQuestionnaireItem,
        groupStats: GroupStats,
    ): 'wait' | 'process' | 'finish' | 'error' => {
        const groupValues = formValues?.[linkId]?.items?.[item.linkId].items;
        const hasError =
            questionnaireItemsToValidationSchema(item.item!, baseQRFPropsContext?.customYupTests).isValidSync(
                groupValues,
            ) === false;

        if (hasError && isSubmitted) {
            return 'error';
        }

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
            status: getGroupStatus(item, groupStats),
            description,
        };
    };

    const stepsItems: WizardItem[] = useMemo(
        () => wizardItems.map((item) => getStepItem(item)),
        [wizardItems, formValues, isSubmitted],
    );

    const onStepChange = (value: number) => {
        setCurrentIndex(value);
    };

    if (parentPath.length !== 0) {
        console.error('The wizard item control must be in root group');

        return <Text>The wizard item control must be in root group</Text>;
    }

    if (wizardItems.some((i) => i.type !== 'group')) {
        console.error('The wizard item control must contain only group items');

        return <Text>The wizard item control must contain only group items</Text>;
    }

    return (
        <Wizard items={stepsItems} currentIndex={currentIndex} onChange={onStepChange} {...props.wizard}>
            {wizardItems.map((groupItem, index) => {
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
            {hiddenItems.map((groupItem) => {
                return (
                    <S.Group key={`group-item-${groupItem.linkId}`} $hidden>
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
            <S.WizardFooter
                goBack={() => setCurrentIndex((i) => i - 1)}
                goForward={() => setCurrentIndex((i) => i + 1)}
                canGoBack={currentIndex > 0}
                canGoForward={currentIndex + 1 < itemsCount}
            >
                {baseQRFPropsContext && <S.FormFooter {...baseQRFPropsContext} submitDisabled={!isLastStepActive} />}
            </S.WizardFooter>
        </Wizard>
    );
}

const getGroupEnabledQuestions = (
    groupItem: FCEQuestionnaireItem,
    groupParentPath: string[],
    groupValues: FormItems,
    formValues: FormItems,
    groupContext: ItemContext[],
) => {
    const groupRelativePath = [groupItem.linkId, 'items'];
    const groupPath = [...groupParentPath, ...groupRelativePath];
    const directItems = getEnabledQuestions(groupItem.item!, groupPath, formValues, groupContext[0]!);

    const allEnabledQuestions: [FCEQuestionnaireItem, boolean][] = [];

    directItems.forEach((item) => {
        if (item.type === 'group') {
            if (item.item) {
                const nestedQuestions = getGroupEnabledQuestions(
                    item,
                    groupPath,
                    _.get(groupValues, groupRelativePath, {} as FormItems),
                    formValues,
                    groupContext,
                );
                allEnabledQuestions.push(...nestedQuestions);
            }
        } else if (item.type !== 'display') {
            const answers = cleanFormAnswerItems(
                _.get(groupValues, [...groupRelativePath, item.linkId], []) as (FormAnswerItems | undefined)[],
            );
            allEnabledQuestions.push([item, answers.length > 0]);
        }
    });

    return allEnabledQuestions.filter(([q, _hasAnswers]) => !q.hidden);
};

export const getGroupStats = (
    groupItem: FCEQuestionnaireItem,
    parentPath: string[],
    formValues: FormItems,
    context: ItemContext[],
): GroupStats => {
    const groupParentPath = [...parentPath, 'items'];
    const allQuestions = getGroupEnabledQuestions(
        groupItem,
        groupParentPath,
        _.get(formValues, groupParentPath),
        formValues,
        context,
    );
    const allRequiredQuestions = allQuestions.filter(([q, _hasAnswers]) => q.required === true);

    const finishedQuestions = allQuestions.filter(([_q, hasAnswers]) => hasAnswers);
    const finishedRequiredQuestions = allRequiredQuestions.filter(([_q, hasAnswers]) => hasAnswers);

    return {
        totalQuestions: allQuestions.length,
        finishedQuestions: finishedQuestions.length,
        totalRequiredQuestions: allRequiredQuestions.length,
        finishedRequiredQuestions: finishedRequiredQuestions.length,
    };
};
