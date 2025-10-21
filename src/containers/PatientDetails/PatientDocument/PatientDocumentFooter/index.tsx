import { t } from '@lingui/macro';
import { QuestionnaireResponse } from 'fhir/r4b';
import { useCallback, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { calcInitialContext } from 'sdc-qrf';

import { RemoteDataResult } from '@beda.software/remote-data';

import { BaseQuestionnaireResponseFormPropsContext } from 'src/components/BaseQuestionnaireResponseForm/context';
import { FormFooter, FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';

import { S } from './styles';

export interface PatientDocumentFooterProps extends FormFooterComponentProps {
    saveButtonTitle?: React.ReactNode;
    saveDraftButtonTitle?: React.ReactNode;
    onSaveDraft?: (questionnaireResponse: QuestionnaireResponse) => Promise<RemoteDataResult<QuestionnaireResponse>>;
}

export function PatientDocumentFooter(props: PatientDocumentFooterProps) {
    const { submitting, submitDisabled, saveButtonTitle, saveDraftButtonTitle, onCancel, onSaveDraft } = props;

    const baseQRFPropsContext = useContext(BaseQuestionnaireResponseFormPropsContext);
    const qrfDataContext = baseQRFPropsContext?.formData.context;

    const formContext = useFormContext();

    const formValues = formContext.getValues();
    const rootContext = qrfDataContext ? calcInitialContext(qrfDataContext, formValues) : undefined;

    const handleSaveDraft = useCallback(async () => {
        if (rootContext?.resource) {
            await onSaveDraft?.(rootContext.resource);
            onCancel?.();
        } else {
            onCancel?.();
        }
    }, [onSaveDraft, rootContext?.resource, onCancel]);

    return (
        <S.Footer>
            {baseQRFPropsContext && baseQRFPropsContext.formData && (
                <>
                    <S.Button onClick={handleSaveDraft}>{saveDraftButtonTitle || t`Save as Draft`}</S.Button>

                    <FormFooter
                        submitting={submitting}
                        submitDisabled={submitDisabled}
                        onCancel={onCancel}
                        formData={baseQRFPropsContext.formData}
                        saveButtonTitle={saveButtonTitle || t`Complete`}
                    />
                </>
            )}
        </S.Footer>
    );
}
