import { QuestionnaireResponse } from 'fhir/r4b';
import {  useContext, useState } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { FCEQuestionnaireItem, FormItems, GroupItemProps, ItemContext, QuestionItems } from 'sdc-qrf';
import { getEnabledQuestions } from 'sdc-qrf/src/utils.ts';

import { Text } from 'src/components/Typography';
import { Wizard, WizardItem, WizardProps } from 'src/components/Wizard';
import { compileAsFirst, questionnaireItemsToValidationSchema } from 'src/utils';

import { S } from './styles';
import { BaseQuestionnaireResponseFormPropsContext } from '../../context';

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

const getAnswerByLinkId = (linkId: string) =>
    compileAsFirst<QuestionnaireResponse, string>(`repeat(item).where(linkId='${linkId}').answer.first()`);

interface GroupStats {
    totalQuestions: number;
    finishedQuestions: number;
    totalRequiredQuestions: number;
    finishedRequiredQuestions: number;
}

export function GroupWizard(props: GroupWizardProps) {
    const { parentPath, questionItem, context, wizard } = props;
    const baseQRFPropsContext = useContext(BaseQuestionnaireResponseFormPropsContext);

    const [currentIndex, setCurrentIndex] = useState(0);
    const { item = [], linkId } = questionItem;

    const formValues = useWatch();

    const { isSubmitted } = useFormState();

    const itemsCount = item.length;
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
            ? `${groupStats.finishedQuestions} of ${groupStats.totalQuestions} (${groupStats.finishedRequiredQuestions} of ${groupStats.totalRequiredQuestions} required)`
            : undefined;

        return {
            title: item.text,
            linkId: item.linkId,
            status: getGroupStatus(item, groupStats),
            description,
        };
    };

    const stepsItems: WizardItem[] = item.map((qItem) => getStepItem(qItem));

    const onStepChange = (value: number) => {
        setCurrentIndex(value);
    };

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
    formValues: FormItems,
    groupContext: ItemContext[],
) => {
    const groupPath = [...groupParentPath, groupItem.linkId, 'items'];
    const directItems = getEnabledQuestions(groupItem.item!, groupPath, formValues, groupContext[0]!);

    const allEnabledQuestions: FCEQuestionnaireItem[] = [];

    directItems.forEach((item) => {
        if (item.type === 'group' && item.item) {
            const nestedQuestions = getGroupEnabledQuestions(item, groupPath, formValues, groupContext);
            allEnabledQuestions.push(...nestedQuestions);
        } else {
            allEnabledQuestions.push(item);
        }
    });

    return allEnabledQuestions.filter((q) => !q.hidden);
};

const getGroupStats = (
    groupItem: FCEQuestionnaireItem,
    parentPath: string[],
    formValues: FormItems,
    context: ItemContext[],
): GroupStats => {
    const qr = context[0]!.QuestionnaireResponse;

    const allQuestions = getGroupEnabledQuestions(groupItem, [...parentPath, 'items'], formValues, context);
    const allRequiredQuestions = allQuestions.filter((q) => q.required === true);

    const finishedQuestions = allQuestions.map((q) => getAnswerByLinkId(q.linkId)(qr)).filter((a) => a !== undefined);
    const finishedRequiredQuestions = allRequiredQuestions
        .map((q) => getAnswerByLinkId(q.linkId)(qr))
        .filter((a) => a !== undefined);

    return {
        totalQuestions: allQuestions.length,
        finishedQuestions: finishedQuestions.length,
        totalRequiredQuestions: allRequiredQuestions.length,
        finishedRequiredQuestions: finishedRequiredQuestions.length,
    };
};
