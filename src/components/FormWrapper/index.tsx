import classNames from 'classnames';
import { QuestionnaireResponse } from 'fhir/r4b';
import { ReactElement, useState } from 'react';
import { GroupItemProps } from 'sdc-qrf';

import { FormWrapperProps } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/BaseQuestionnaireResponseForm';
import { RemoteDataResult } from '@beda.software/remote-data';

// import { isGroupWizard } from 'src/components';
import { BaseQuestionnaireResponseFormPropsContext } from 'src/components/BaseQuestionnaireResponseForm/context';
import { groupComponent } from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormFooter } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';

import s from './FormWrapper.module.scss';

export function FormWrapper(
    props: FormWrapperProps & {
        // formData?: QuestionnaireResponseFormData;
        onCancel?: () => void;
        onSaveDraft?: (
            questionnaireResponse: QuestionnaireResponse,
        ) => Promise<RemoteDataResult<QuestionnaireResponse>>;
        saveButtonTitle?: string | ReactElement;
    },
) {
    const { handleSubmit, items, onCancel, onSaveDraft, saveButtonTitle } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // const isWizard = formData?.context?.fceQuestionnaire ? isGroupWizard(formData.context.fceQuestionnaire) : false;

    return (
        <form
            onSubmit={async (event) => {
                setIsSubmitting(true);
                await handleSubmit(event);
                setIsSubmitting(false);
            }}
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
                <div className={classNames(s.content, 'form__content')}>{items}</div>
                {/* {!isWizard ? ( */}

                <FormFooter
                    {...props}
                    onSaveDraft={onSaveDraft}
                    submitting={isSubmitting}
                    onCancel={onCancel}
                    saveButtonTitle={saveButtonTitle}
                />
                {/*) : null} */}
            </BaseQuestionnaireResponseFormPropsContext.Provider>
        </form>
    );
}

export function ReadonlyFormWrapper(
    props: FormWrapperProps & {
        // formData?: QuestionnaireResponseFormData;
        onCancel?: () => void;
        onSaveDraft?: (
            questionnaireResponse: QuestionnaireResponse,
        ) => Promise<RemoteDataResult<QuestionnaireResponse>>;
        saveButtonTitle?: string | ReactElement;
    },
) {
    const { handleSubmit, items, onCancel } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // const isWizard = formData?.context?.fceQuestionnaire ? isGroupWizard(formData.context.fceQuestionnaire) : false;

    return (
        <form
            onSubmit={async (event) => {
                setIsSubmitting(true);
                await handleSubmit(event);
                setIsSubmitting(false);
            }}
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
                <div className={classNames(s.content, 'form__content')}>{items}</div>
                {/* {!isWizard ? ( */}

                {/*) : null} */}
            </BaseQuestionnaireResponseFormPropsContext.Provider>
        </form>
    );
}
export function GroupItemComponent(itemProps: GroupItemProps) {
    const Control = groupComponent;

    return <Control {...itemProps} />;
}
