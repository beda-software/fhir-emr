import { Trans } from '@lingui/macro';
import _ from 'lodash';
import { useContext, useState } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Text } from 'src/components/Typography';
import { Wizard, WizardItem } from 'src/components/Wizard';
import { questionnaireItemsToValidationSchema } from 'src/utils';

import { GroupWizardControlContext } from './context';
import { S } from './styles';
import { BaseQuestionnaireResponseFormPropsContext } from '../../context';

export function GroupWizard(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;

    const [currentIndex, setCurrentIndex] = useState(0);
    const { item = [], linkId } = questionItem;

    const formValues = useWatch();
    const { isSubmitted } = useFormState();

    const itemsCount = item.length;
    const stepsItems: WizardItem[] = item.map((i) => {
        const groupValues = formValues?.[linkId]?.items?.[i.linkId].items;
        const hasError = questionnaireItemsToValidationSchema(i.item!).isValidSync(groupValues) === false;

        return {
            title: i.text,
            status: hasError && isSubmitted ? 'error' : undefined,
        };
    });

    const onStepChange = (value: number) => {
        setCurrentIndex(value);
    };

    const wizardControlProps = useContext(GroupWizardControlContext);
    const qrFormProps = useContext(BaseQuestionnaireResponseFormPropsContext);
    const submitTitle = wizardControlProps.saveButtonTitle || qrFormProps?.saveButtonTitle || (
        <Trans>Save & complete</Trans>
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
        <Wizard items={stepsItems} currentIndex={currentIndex} onChange={onStepChange} {...wizardControlProps.wizard}>
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
                {qrFormProps && (
                    <S.FormFooter {..._.omit(qrFormProps, ['saveButtonTitle'])} saveButtonTitle={submitTitle} />
                )}
            </S.WizardFooter>
        </Wizard>
    );
}
