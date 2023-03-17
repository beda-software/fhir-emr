import { yupResolver } from '@hookform/resolvers/yup';
import { Trans } from '@lingui/macro';
import { RemoteData } from 'aidbox-react';
import { Button } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    calcInitialContext,
    FormItems,
    GroupItemComponent,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponentMapping,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';
import * as yup from 'yup';

import 'react-phone-input-2/lib/style.css';

import { isFailure, isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { questionnaireToValidationSchema } from 'src/utils/questionnaire';

import s from './BaseQuestionnaireResponseForm.module.scss';
import {
    Col,
    Group,
    InlineChoice,
    TimeRangePickerControl,
    QuestionBoolean,
    QuestionChoice,
    QuestionDateTime,
    QuestionDecimal,
    QuestionInteger,
    QuestionPhone,
    QuestionSlider,
    QuestionSolidRadio,
    QuestionString,
    QuestionText,
    Row,
    PractitionerRoleList,
    BloodPressure,
} from './widgets';
import { Display } from './widgets/display';
import { QuestionReference } from './widgets/reference';

export interface BaseQuestionnaireResponseFormProps {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    questionItemComponents?: QuestionItemComponentMapping;
    groupItemComponent?: GroupItemComponent;
    onCancel?: () => void;
    onSaveDraft?: (formData: QuestionnaireResponseFormData) => Promise<any>;
}

export function BaseQuestionnaireResponseForm(props: BaseQuestionnaireResponseFormProps) {
    const { onSubmit, formData, readOnly, onCancel, onSaveDraft } = props;

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

    const isSaving = useRef(false);
    const saveDraftTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const saveDraft = useCallback(async () => {
        if (!onSaveDraft || isSaving.current) return;

        isSaving.current = true;

        const draftFormData = { ...formData };

        const response: RemoteData<QuestionnaireResponse, any> = await onSaveDraft({
            ...draftFormData,
            formValues,
        });
        if (isSuccess(response)) {
            draftFormData.context = draftFormData.context || {};
            draftFormData.context.questionnaireResponse.id = response.data.id;
        }
        if (isFailure(response)) {
            console.error('Error saving a draft: ', response.error);
        }

        isSaving.current = false;
    }, [formData, formValues, onSaveDraft]);

    useEffect(() => {
        if (saveDraftTimeout.current) clearTimeout(saveDraftTimeout.current);
        saveDraftTimeout.current = setTimeout(saveDraft, 1000);

        return () => {
            if (saveDraftTimeout.current) clearTimeout(saveDraftTimeout.current);
        };
    }, [saveDraft]);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(() => onSubmit({ ...formData, formValues }))}
                className={classNames(s.form, 'app-form')}
            >
                <QuestionnaireResponseFormProvider
                    formValues={formValues}
                    setFormValues={(values, fieldPath, value) =>
                        setValue(fieldPath.join('.'), value)
                    }
                    groupItemComponent={Group}
                    itemControlGroupItemComponents={{
                        col: Col,
                        row: Row,
                        'blood-pressure': BloodPressure,
                        'time-range-picker': TimeRangePickerControl,
                        ...props.itemControlGroupItemComponents,
                    }}
                    questionItemComponents={{
                        text: QuestionText,
                        string: QuestionString,
                        decimal: QuestionDecimal,
                        integer: QuestionInteger,
                        date: QuestionDateTime,
                        dateTime: QuestionDateTime,
                        time: QuestionDateTime,
                        choice: QuestionChoice,
                        boolean: QuestionBoolean,
                        display: Display,
                        reference: QuestionReference,
                        ...props.questionItemComponents,
                    }}
                    itemControlQuestionItemComponents={{
                        phoneWidget: QuestionPhone,
                        slider: QuestionSlider,
                        'solid-radio-button': QuestionSolidRadio,
                        'inline-choice': InlineChoice,
                        'practitioner-role': PractitionerRoleList,
                        ...props.itemControlQuestionItemComponents,
                    }}
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
                        {!readOnly && (
                            <div className={classNames(s.footer, 'form__footer')}>
                                {onCancel && (
                                    <Button key="back" onClick={onCancel}>
                                        <Trans>Cancel</Trans>
                                    </Button>
                                )}
                                <Button type="primary" htmlType="submit">
                                    <Trans>Save</Trans>
                                </Button>
                            </div>
                        )}
                    </>
                </QuestionnaireResponseFormProvider>
            </form>
        </FormProvider>
    );
}
