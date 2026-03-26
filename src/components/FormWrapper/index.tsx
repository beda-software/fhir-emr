import classNames from 'classnames';
import { QuestionnaireResponse } from 'fhir/r4b';
import { useState } from 'react';
import { GroupItemProps, QuestionnaireResponseFormData } from 'sdc-qrf';

import { RemoteDataResult } from '@beda.software/remote-data';

import { isGroupWizard } from 'src/components';
import { groupComponent } from 'src/components/BaseQuestionnaireResponseForm/controls';
import { FormFooter } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';
import { FormWrapperProps } from 'src/packages/@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/BaseQuestionnaireResponseForm';

import s from './FormWrapper.module.scss';

export function FormWrapper(
    props: FormWrapperProps & {
        formData: QuestionnaireResponseFormData;
        onCancel?: () => void;
        onSaveDraft?: (
            questionnaireResponse: QuestionnaireResponse,
        ) => Promise<RemoteDataResult<QuestionnaireResponse>>;
    },
) {
    const { handleSubmit, items, formData, onCancel, onSaveDraft } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isWizard = isGroupWizard(formData.context.fceQuestionnaire);

    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                setIsSubmitting(true);
                await handleSubmit();
                setIsSubmitting(false);
            }}
            className={classNames(s.form, 'app-form')}
            noValidate
        >
            {items}
            {!isWizard ? (
                <FormFooter {...props} onSaveDraft={onSaveDraft} submitting={isSubmitting} onCancel={onCancel} />
            ) : null}
        </form>
    );
}

export function GroupItemComponent(itemProps: GroupItemProps) {
    const Control = groupComponent;

    return <Control {...itemProps} />;
}
