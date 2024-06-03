import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import React, { ComponentType, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    calcInitialContext,
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

import { RemoteData, isSuccess, loading } from '@beda.software/remote-data';

import { saveQuestionnaireResponseDraft } from 'src/components/QuestionnaireResponseForm';
import { questionnaireToValidationSchema } from 'src/utils/questionnaire';

import s from './BaseQuestionnaireResponseForm.module.scss';
import { ItemControlGroupItemWidgetsContext, ItemControlQuestionItemWidgetsContext } from './context';
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
    draftSaveResponse?: RemoteData<QuestionnaireResponse>;
    setDraftSaveResponse?: (data: RemoteData<QuestionnaireResponse>) => void;
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
    saveButtonTitle?: string;
    cancelButtonTitle?: string;
}

export function BaseQuestionnaireResponseForm(props: BaseQuestionnaireResponseFormProps) {
    const {
        onSubmit,
        formData,
        readOnly,
        autoSave,
        draftSaveResponse,
        setDraftSaveResponse,
        ItemWrapper,
        GroupWrapper,
    } = props;

    const questionnaireId = formData.context.questionnaire.assembledFrom;

    const schema: yup.AnyObjectSchema = useMemo(
        () => questionnaireToValidationSchema(formData.context.questionnaire),
        [formData.context.questionnaire],
    );

    const methods = useForm<FormItems>({
        defaultValues: formData.formValues,
        resolver: yupResolver(schema),
        mode: 'onBlur',
    });
    const { setValue, handleSubmit, watch } = methods;

    const formValues = watch();

    const [isLoading, setIsLoading] = useState(false);

    const previousFormValuesRef = useRef<FormItems | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSaveDraft = useCallback(
        _.debounce(async (currentFormValues: FormItems) => {
            if (!autoSave || !questionnaireId) return;

            if (!_.isEqual(currentFormValues, previousFormValuesRef.current) && setDraftSaveResponse) {
                setDraftSaveResponse(loading);
                setDraftSaveResponse(
                    await saveQuestionnaireResponseDraft(questionnaireId, formData, currentFormValues),
                );
                previousFormValuesRef.current = _.cloneDeep(currentFormValues);
            }
        }, 1000),
        [],
    );

    useEffect(() => {
        debouncedSaveDraft(formValues);
    }, [formValues, debouncedSaveDraft]);

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

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(async () => {
                    setIsLoading(true);
                    if (questionnaireId && draftSaveResponse && isSuccess(draftSaveResponse)) {
                        formData.context.questionnaireResponse.id = draftSaveResponse.data.id;
                    }
                    await onSubmit?.({ ...formData, formValues });
                    setIsLoading(false);
                })}
                className={classNames(s.form, 'app-form')}
            >
                <QuestionnaireResponseFormProvider
                    formValues={formValues}
                    setFormValues={(values, fieldPath, value) => setValue(fieldPath.join('.'), value)}
                    groupItemComponent={groupItemComponent}
                    itemControlGroupItemComponents={itemControlGroupItemComponents}
                    questionItemComponents={questionItemComponents}
                    itemControlQuestionItemComponents={itemControlQuestionItemComponents}
                    readOnly={readOnly}
                >
                    <>
                        <div className={classNames(s.content, 'form__content')}>
                            <QuestionItems
                                questionItems={formData.context.questionnaire.item!}
                                parentPath={[]}
                                context={calcInitialContext(formData.context, formValues)}
                            />
                        </div>
                        <FormFooter {...props} submitting={isLoading} />
                    </>
                </QuestionnaireResponseFormProvider>
            </form>
        </FormProvider>
    );
}
