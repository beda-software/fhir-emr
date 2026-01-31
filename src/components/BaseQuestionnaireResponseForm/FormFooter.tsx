import { Trans, t } from '@lingui/macro';
import { Button } from 'antd';
import { QuestionnaireResponse } from 'fhir/r4b';
import { CSSProperties, useCallback, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { calcInitialContext } from 'sdc-qrf';

import { RemoteDataResult } from '@beda.software/remote-data';

import { BaseQuestionnaireResponseFormPropsContext } from 'src/components/BaseQuestionnaireResponseForm/context';

import { BaseQuestionnaireResponseFormProps } from '.';
import { S } from './BaseQuestionnaireResponseForm.styles';

export interface FormFooterComponentProps {
    submitting: boolean;
    submitDisabled?: boolean;
    onCancel?: () => void;
    onSaveDraft?: (questionnaireResponse: QuestionnaireResponse) => Promise<RemoteDataResult<QuestionnaireResponse>>;
}

export interface Props extends BaseQuestionnaireResponseFormProps {
    submitting: boolean;
    className?: string | undefined;
    style?: CSSProperties | undefined;
    submitDisabled?: boolean;
}

export function FormFooter(props: Props) {
    const {
        readOnly,
        onCancel,
        FormFooterComponent,
        saveButtonTitle,
        cancelButtonTitle,
        submitting,
        className,
        style,
        submitDisabled: initialSubmitDisabled,
        saveDraftButtonTitle,
        onSaveDraft,
    } = props;

    const baseQRFPropsContext = useContext(BaseQuestionnaireResponseFormPropsContext);

    const formContext = useFormContext();

    const handleSaveDraft = useCallback(async () => {
        const qrfDataContext = baseQRFPropsContext?.formData.context;
        const formValues = formContext.getValues();
        const rootContext = qrfDataContext ? calcInitialContext(qrfDataContext, formValues) : undefined;

        if (rootContext?.resource) {
            await onSaveDraft?.(rootContext.resource);
            onCancel?.();
        } else {
            onCancel?.();
        }
    }, [baseQRFPropsContext?.formData.context, formContext, onSaveDraft, onCancel]);

    if (readOnly) {
        return null;
    }

    const submitDisabled = submitting || initialSubmitDisabled;

    const isSomeButtonInLoading = submitting;

    return (
        <>
            {FormFooterComponent ? (
                <FormFooterComponent submitting={submitting} submitDisabled={submitDisabled} onCancel={onCancel} />
            ) : (
                <S.Footer className={className} style={style}>
                    {onCancel && (
                        <Button
                            type="default"
                            onClick={onCancel}
                            data-testid="cancel-button"
                            disabled={isSomeButtonInLoading}
                        >
                            {cancelButtonTitle ?? <Trans>Cancel</Trans>}
                        </Button>
                    )}
                    {onSaveDraft && (
                        <Button
                            onClick={handleSaveDraft}
                            data-testid="save-as-draft-button"
                            disabled={isSomeButtonInLoading}
                        >
                            {saveDraftButtonTitle || t`Save as draft`}
                        </Button>
                    )}
                    <Button
                        type="primary"
                        htmlType="submit"
                        data-testid="submit-button"
                        loading={submitting}
                        disabled={submitDisabled || isSomeButtonInLoading}
                    >
                        {saveButtonTitle ?? <Trans>Save</Trans>}
                    </Button>
                </S.Footer>
            )}
        </>
    );
}
