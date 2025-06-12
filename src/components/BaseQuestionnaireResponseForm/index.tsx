import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import _ from 'lodash';
import React, { ComponentType, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    calcInitialContext,
    FCEQuestionnaire,
    FormItems,
    GroupItemComponent,
    GroupItemProps,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponent,
    QuestionItemComponentMapping,
    QuestionItemProps,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';
import * as yup from 'yup';

import 'react-phone-input-2/lib/style.css';

import {
    deleteQuestionnaireResponseDraft,
    getQuestionnaireResponseDraftId,
    saveQuestionnaireResponseDraft,
} from 'src/components/QuestionnaireResponseForm';
import { QuestionnaireResponseDraftService } from 'src/hooks';
import { useDebounce } from 'src/utils';
import { questionnaireToValidationSchema } from 'src/utils/questionnaire';

import s from './BaseQuestionnaireResponseForm.module.scss';
import {
    BaseQuestionnaireResponseFormPropsContext,
    ItemControlGroupItemWidgetsContext,
    ItemControlQuestionItemWidgetsContext,
} from './context';
import { groupComponent, groupControlComponents, itemComponents, itemControlComponents } from './controls';
import { FormFooterComponentProps, FormFooter } from './FormFooter';

export interface BaseQuestionnaireResponseFormProps {
    formData: QuestionnaireResponseFormData;
    onSubmit?: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    questionItemComponents?: QuestionItemComponentMapping;
    groupItemComponent?: GroupItemComponent;
    onCancel?: () => void;

    autoSave?: boolean;
    qrDraftServiceType?: QuestionnaireResponseDraftService;

    ItemWrapper?: ComponentType<{
        item: QuestionItemProps;
        control: QuestionItemComponent;
        children: React.ReactElement;
    }>;
    GroupWrapper?: ComponentType<{
        item: GroupItemProps;
        control: GroupItemComponent;
        children: React.ReactElement;
    }>;

    FormFooterComponent?: React.ElementType<FormFooterComponentProps>;
    saveButtonTitle?: React.ReactNode;
    cancelButtonTitle?: React.ReactNode;
}

export function BaseQuestionnaireResponseForm(props: BaseQuestionnaireResponseFormProps) {
    const {
        onSubmit,
        formData,
        readOnly,
        ItemWrapper,
        GroupWrapper,
        autoSave,
        qrDraftServiceType = 'local',
        onCancel,
    } = props;

    const questionnaireId = formData.context.fceQuestionnaire.assembledFrom;

    const draftId = getQuestionnaireResponseDraftId({
        subject: formData.context.questionnaireResponse.subject,
        questionnaireId,
        questionnaireResponseId: formData.context.questionnaireResponse.id,
    });

    const schema: yup.AnyObjectSchema = useMemo(
        () => questionnaireToValidationSchema(formData.context.fceQuestionnaire),
        [formData.context.fceQuestionnaire],
    );

    const methods = useForm<FormItems>({
        defaultValues: formData.formValues,
        resolver: yupResolver(schema),
        mode: 'onBlur',
    });
    const { setValue, handleSubmit, watch } = methods;

    const formValues = watch();
    const debouncedFormValues = useDebounce(formValues, 300);

    const [isLoading, setIsLoading] = useState(false);

    const previousFormValuesRef = useRef<FormItems | null>(_.cloneDeep(formValues));

    const saveDraft = useCallback(
        async (currentFormValues: FormItems) => {
            if (!questionnaireId || !formData) {
                return;
            }
            if (!_.isEqual(currentFormValues, previousFormValuesRef.current)) {
                await saveQuestionnaireResponseDraft(draftId, formData, currentFormValues, qrDraftServiceType);

                previousFormValuesRef.current = _.cloneDeep(currentFormValues);
            }
        },
        [draftId, formData, qrDraftServiceType, questionnaireId],
    );

    const isRunningDebouncedSaveDraftRef = useRef(false);
    const debouncedSaveDraftRef = useRef<ReturnType<typeof _.debounce> | null>(null);

    useEffect(() => {
        debouncedSaveDraftRef.current = _.debounce(async (currentFormValues: FormItems) => {
            if (!autoSave || !questionnaireId) return;

            if (isRunningDebouncedSaveDraftRef.current) {
                return;
            }

            isRunningDebouncedSaveDraftRef.current = true;

            try {
                await saveDraft(currentFormValues);
            } finally {
                isRunningDebouncedSaveDraftRef.current = false;
            }
        }, 1000);

        debouncedSaveDraftRef.current?.(debouncedFormValues);

        return () => {
            debouncedSaveDraftRef.current?.cancel();
        };
    }, [debouncedFormValues]);

    const wrapControls = useCallback(
        (mapping: { [x: string]: QuestionItemComponent }): { [x: string]: QuestionItemComponent } => {
            return _.chain(mapping)
                .toPairs()
                .map(([key, Control]) => [
                    key,
                    (itemProps: QuestionItemProps) => {
                        if (ItemWrapper) {
                            return (
                                <ItemWrapper item={itemProps} control={Control}>
                                    <Control {...itemProps} />
                                </ItemWrapper>
                            );
                        }

                        return <Control {...itemProps} />;
                    },
                ])
                .fromPairs()
                .value();
        },
        [ItemWrapper],
    );

    const wrapGroups = useCallback(
        (mapping: { [x: string]: GroupItemComponent }): { [x: string]: GroupItemComponent } => {
            return _.chain(mapping)
                .toPairs()
                .map(([key, Control]) => [
                    key,
                    (itemProps: GroupItemProps) => {
                        if (GroupWrapper) {
                            return (
                                <GroupWrapper item={itemProps} control={Control}>
                                    <Control {...itemProps} />
                                </GroupWrapper>
                            );
                        }

                        return <Control {...itemProps} />;
                    },
                ])
                .fromPairs()
                .value();
        },
        [GroupWrapper],
    );

    const itemControlQuestionItemFromContext = useContext(ItemControlQuestionItemWidgetsContext);
    const itemControlQuestionGroupFromContext = useContext(ItemControlGroupItemWidgetsContext);

    const questionItemComponents = useMemo(
        () =>
            wrapControls({
                ...itemComponents,
                ...props.questionItemComponents,
            }),
        [wrapControls, props.questionItemComponents],
    );
    const itemControlQuestionItemComponents = useMemo(
        () =>
            wrapControls({
                ...itemControlComponents,
                ...itemControlQuestionItemFromContext,
                ...props.itemControlQuestionItemComponents,
            }),
        [wrapControls, itemControlQuestionItemFromContext, props.itemControlQuestionItemComponents],
    );

    const itemControlGroupItemComponents = useMemo(
        () =>
            wrapGroups({
                ...groupControlComponents,
                ...itemControlQuestionGroupFromContext,
                ...props.itemControlGroupItemComponents,
            }),
        [wrapGroups, itemControlQuestionGroupFromContext, props.itemControlGroupItemComponents],
    );
    const groupItemComponent = useMemo(
        () =>
            function GroupItemComponent(itemProps: GroupItemProps) {
                const Control = groupComponent;

                if (GroupWrapper) {
                    return (
                        <GroupWrapper item={itemProps} control={Control}>
                            <Control {...itemProps} />
                        </GroupWrapper>
                    );
                }

                return <Control {...itemProps} />;
            },
        [GroupWrapper],
    );

    const isWizard = isGroupWizard(formData.context.fceQuestionnaire);

    const handleOnCancel = useCallback(() => {
        debouncedSaveDraftRef.current?.cancel();
        deleteQuestionnaireResponseDraft(draftId, qrDraftServiceType);
        onCancel?.();
    }, [draftId, onCancel, qrDraftServiceType]);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(async () => {
                    debouncedSaveDraftRef.current?.cancel();
                    isRunningDebouncedSaveDraftRef.current = true;
                    setIsLoading(true);
                    await onSubmit?.({ ...formData, formValues });
                    await deleteQuestionnaireResponseDraft(draftId, qrDraftServiceType);
                    setIsLoading(false);
                })}
                className={classNames(s.form, 'app-form')}
                noValidate
            >
                <BaseQuestionnaireResponseFormPropsContext.Provider
                    value={{
                        ...props,
                        submitting: isLoading,
                        saveDraft,
                        onCancel: handleOnCancel,
                    }}
                >
                    <QuestionnaireResponseFormProvider
                        formValues={formValues}
                        // NOTE: setValue as any is required to speed up performance!
                        setFormValues={(values, fieldPath, value) => (setValue as any)(fieldPath.join('.'), value)}
                        groupItemComponent={groupItemComponent}
                        itemControlGroupItemComponents={itemControlGroupItemComponents}
                        questionItemComponents={questionItemComponents}
                        itemControlQuestionItemComponents={itemControlQuestionItemComponents}
                        readOnly={readOnly}
                    >
                        <>
                            <div className={classNames(s.content, 'form__content')}>
                                <QuestionItems
                                    questionItems={formData.context.fceQuestionnaire.item!}
                                    parentPath={[]}
                                    context={calcInitialContext(formData.context, formValues)}
                                />
                            </div>
                            {!isWizard ? (
                                <FormFooter {...props} submitting={isLoading} onCancel={handleOnCancel} />
                            ) : null}
                        </>
                    </QuestionnaireResponseFormProvider>
                </BaseQuestionnaireResponseFormPropsContext.Provider>
            </form>
        </FormProvider>
    );
}

function isGroupWizard(q: FCEQuestionnaire) {
    return q.item?.some((i) => {
        const itemControlCode = i.itemControl?.coding?.[0]?.code;

        return (
            itemControlCode && ['wizard', 'wizard-with-tooltips', 'wizard-navigation-group'].includes(itemControlCode)
        );
    });
}
