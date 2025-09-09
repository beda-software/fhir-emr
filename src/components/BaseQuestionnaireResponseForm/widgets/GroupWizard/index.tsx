import { StepsProps } from 'antd';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Text } from 'src/components/Typography';
import { Wizard, WizardItem, WizardProps } from 'src/components/Wizard';
import { questionnaireItemsToValidationSchema } from 'src/utils';

import { S } from './styles';
import { BaseQuestionnaireResponseFormPropsContext } from '../../context';

interface GroupWizardProps extends GroupItemProps {
    wizard?: Partial<WizardProps>;
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

export function GroupWizard(props: GroupWizardProps) {
    const { parentPath, questionItem, context } = props;
    const baseQRFPropsContext = useContext(BaseQuestionnaireResponseFormPropsContext);

    const [currentIndex, setCurrentIndex] = useState(0);
    const { item = [], linkId } = questionItem;

    const formValues = useWatch();

    const { isSubmitted } = useFormState();

    const itemsCount = item.length;
    const isLastStepActive = itemsCount === currentIndex + 1;

    const [stepsStatuses, setStepsStatuses] = useState<StepsProps['status'][]>(
        item.map((i, index) => {
            if (index === currentIndex) {
                return 'process';
            }

            return 'wait';
        }),
    );

    const stepsItems: WizardItem[] = useMemo(
        () =>
            item.map((i, index) => {
                const groupValues = formValues?.[linkId]?.items?.[i.linkId].items;
                const hasError =
                    questionnaireItemsToValidationSchema(i.item!, baseQRFPropsContext?.customYupTests).isValidSync(
                        groupValues,
                    ) === false;
                return {
                    title: i.text,
                    linkId: i.linkId,
                    status: hasError && isSubmitted ? 'error' : stepsStatuses[index],
                };
            }),
        [item, formValues, linkId, baseQRFPropsContext?.customYupTests, isSubmitted, stepsStatuses],
    );

    const handleStepChange = useCallback((value: number) => {
        setCurrentIndex((prevIndex) => {
            const newIndex = value;
            setStepsStatuses((prev) => {
                const newStepsStatuses = [...prev];
                newStepsStatuses[newIndex] = 'process';
                newStepsStatuses[prevIndex] = 'finish';
                return newStepsStatuses;
            });
            return newIndex;
        });
    }, []);

    if (parentPath.length !== 0) {
        console.error('The wizard item control must be in root group');

        return <Text>The wizard item control must be in root group</Text>;
    }

    if (item.some((i) => i.type !== 'group')) {
        console.error('The wizard item control must contain only group items');

        return <Text>The wizard item control must contain only group items</Text>;
    }

    return (
        <Wizard items={stepsItems} currentIndex={currentIndex} onChange={handleStepChange} {...props.wizard}>
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
                goBack={() => handleStepChange(currentIndex - 1)}
                goForward={() => handleStepChange(currentIndex + 1)}
                canGoBack={currentIndex > 0}
                canGoForward={currentIndex + 1 < itemsCount}
            >
                {baseQRFPropsContext && <S.FormFooter {...baseQRFPropsContext} submitDisabled={!isLastStepActive} />}
            </S.WizardFooter>
        </Wizard>
    );
}
