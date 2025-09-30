import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import React, { ComponentType, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useFormState, useWatch } from 'react-hook-form';
import {
    calcInitialContext,
    FCEQuestionnaire,
    FormItems,
    getEnabledQuestions,
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

import { CustomYupTestsMap, questionnaireToValidationSchema } from 'src/utils/questionnaire';

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
    onSubmit?: (formData: QuestionnaireResponseFormData) => Promise<void>;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    questionItemComponents?: QuestionItemComponentMapping;
    groupItemComponent?: GroupItemComponent;
    onCancel?: () => void;

    onQRFUpdate?: (questionnaireResponse: QuestionnaireResponse) => void;

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

    customYupTests?: CustomYupTestsMap;
}

export function BaseQuestionnaireResponseForm(props: BaseQuestionnaireResponseFormProps) {
    const { onSubmit, formData, readOnly, ItemWrapper, GroupWrapper, onCancel, customYupTests, onQRFUpdate } = props;

    const schema: yup.AnyObjectSchema = useMemo(
        () => questionnaireToValidationSchema(formData.context.fceQuestionnaire, customYupTests),
        [formData.context.fceQuestionnaire, customYupTests],
    );

    const methods = useForm<FormItems>({
        defaultValues: formData.formValues,
        resolver: yupResolver(schema),
        mode: 'onBlur',
    });
    const { getValues, setValue, handleSubmit } = methods;

    const formValuesRef = useRef(getValues());

    const formValues =
        useWatch({
            control: methods.control,
            compute: () => {
                const values = getValues();

                if (!_.isEqual(values, formValuesRef.current)) {
                    const prevRootContext = calcInitialContext(formData.context, formValuesRef.current);
                    const prevEnabledQuestions = getEnabledQuestions(
                        formData.context.fceQuestionnaire.item ?? [],
                        [],
                        formValuesRef.current,
                        prevRootContext,
                    );

                    const updatedRootContext = calcInitialContext(formData.context, values);
                    const updatedEnabledQuestions = getEnabledQuestions(
                        formData.context.fceQuestionnaire.item ?? [],
                        [],
                        values,
                        updatedRootContext,
                    );

                    formValuesRef.current = _.cloneDeep(values);

                    if (!_.isEqual(prevEnabledQuestions, updatedEnabledQuestions)) {
                        return formValuesRef.current;
                    }
                }
                return null;
            },
        }) ?? getValues();

    const { isDirty } = useFormState({
        control: methods.control,
    });

    const rootContext = calcInitialContext(formData.context, formValues);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // We use isDirty to trigger the onQRFUpdate callback only when user starts changing the form
        if (isDirty) {
            onQRFUpdate?.(rootContext.resource);
        }
    }, [rootContext.resource, onQRFUpdate, isDirty]);

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

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(async () => {
                    setIsSubmitting(true);
                    await onSubmit?.({ ...formData, formValues: getValues() });
                    setIsSubmitting(false);
                })}
                className={classNames(s.form, 'app-form')}
                noValidate
            >
                <BaseQuestionnaireResponseFormPropsContext.Provider
                    value={{
                        ...props,
                        submitting: isSubmitting,
                        onCancel: onCancel,
                    }}
                >
                    <QuestionnaireResponseFormProvider
                        formValues={formValues}
                        // NOTE: setValue as any is required to speed up performance!
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                    context={rootContext}
                                />
                            </div>
                            {!isWizard ? <FormFooter {...props} submitting={isSubmitting} onCancel={onCancel} /> : null}
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
            itemControlCode &&
            ['wizard', 'wizard-with-tooltips', 'wizard-vertical', 'wizard-navigation-group'].includes(itemControlCode)
        );
    });
}
