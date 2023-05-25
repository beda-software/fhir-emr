import { yupResolver } from '@hookform/resolvers/yup';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import classNames from 'classnames';
import { isSuccess, loading, RemoteData } from 'fhir-react/lib/libs/remoteData';
import { QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import React, { ComponentType, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    calcInitialContext,
    FormItems,
    GroupItemComponent,
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

import { saveQuestionnaireResponseDraft } from 'src/components/QuestionnaireResponseForm';
import { questionnaireToValidationSchema } from 'src/utils/questionnaire';

import s from './BaseQuestionnaireResponseForm.module.scss';
import { groupComponent, groupControlComponents, itemComponents, itemControlComponents } from './controls';

export interface BaseQuestionnaireResponseFormProps {
    formData: QuestionnaireResponseFormData;
    onSubmit?: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    questionItemComponents?: QuestionItemComponentMapping;
    groupItemComponent?: GroupItemComponent;
    onCancel?: () => void;
    saveButtonTitle?: string;
    autoSave?: boolean;
    draftSaveResponse?: RemoteData<QuestionnaireResponse>;
    setDraftSaveResponse?: (data: RemoteData<QuestionnaireResponse>) => void;
    ItemWrapper?: ComponentType<{
        item: QuestionItemProps;
        control: QuestionItemComponent;
        children: React.ReactElement;
    }>;
}

export function BaseQuestionnaireResponseForm(props: BaseQuestionnaireResponseFormProps) {
    const {
        onSubmit,
        formData,
        readOnly,
        onCancel,
        saveButtonTitle,
        autoSave,
        draftSaveResponse,
        setDraftSaveResponse,
        ItemWrapper = (wrapperProps) => <React.Fragment {...wrapperProps} />,
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

    const questionItemComponents = {
        ...itemComponents,
        ...props.questionItemComponents,
    };
    const itemControlQuestionItemComponents = {
        ...itemControlComponents,
        ...props.itemControlQuestionItemComponents,
    };

    const wrapControls = useCallback(
        (mapping: { [x: string]: QuestionItemComponent }): { [x: string]: QuestionItemComponent } => {
            return _.chain(mapping)
                .toPairs()
                .map(([key, Control]) => [
                    key,
                    (itemProps: QuestionItemProps) => (
                        <ItemWrapper item={itemProps} control={Control}>
                            <Control {...itemProps} />
                        </ItemWrapper>
                    ),
                ])
                .fromPairs()
                .value();
        },
        [ItemWrapper],
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
                    groupItemComponent={groupComponent}
                    itemControlGroupItemComponents={{
                        ...groupControlComponents,
                        ...props.itemControlGroupItemComponents,
                    }}
                    questionItemComponents={wrapControls(questionItemComponents)}
                    itemControlQuestionItemComponents={wrapControls(itemControlQuestionItemComponents)}
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
                        {!readOnly && onSubmit && (
                            <div className={classNames(s.footer, 'form__footer')}>
                                {onCancel && (
                                    <Button key="back" onClick={onCancel}>
                                        <Trans>Cancel</Trans>
                                    </Button>
                                )}

                                {isLoading ? (
                                    <Button type="primary" loading>
                                        Saving...
                                    </Button>
                                ) : (
                                    <Button type="primary" htmlType="submit">
                                        <Trans>{saveButtonTitle ?? 'Save'}</Trans>
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                </QuestionnaireResponseFormProvider>
            </form>
        </FormProvider>
    );
}
