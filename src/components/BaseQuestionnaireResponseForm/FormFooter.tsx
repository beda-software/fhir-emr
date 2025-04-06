import { CheckOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { QuestionnaireResponse } from 'fhir/r4b';
import { CSSProperties } from 'react';
import { useWatch } from 'react-hook-form';
import { FormItems } from 'sdc-qrf';

import { WithId } from '@beda.software/fhir-react';
import { isLoading, isSuccess, RemoteData } from '@beda.software/remote-data';

import { useSaveDraft } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import { BaseQuestionnaireResponseFormProps } from '.';
import { S } from './BaseQuestionnaireResponseForm.styles';

export interface FormFooterComponentProps {
    submitting: boolean;
    submitDisabled?: boolean;
    onCancel?: () => void;
}

export interface Props extends BaseQuestionnaireResponseFormProps {
    submitting: boolean;
    saveDraft?: (currentFormValues: FormItems) => Promise<void>;
    className?: string | undefined;
    style?: CSSProperties | undefined;
    submitDisabled?: boolean;
}

export function FormFooter(props: Props) {
    const {
        formData,
        readOnly,
        onCancel,
        FormFooterComponent,
        saveButtonTitle,
        cancelButtonTitle,
        submitting,
        saveDraft,
        autoSave,
        draftSaveResponse,
        setDraftSaveResponse,
        className,
        style,
        submitDisabled: initialSubmitDisabled,
    } = props;

    const formValues = useWatch();
    const assembledFromQuestionnaireId = formData.context.questionnaire.assembledFrom;

    if (readOnly) {
        return null;
    }

    const submitDisabled = submitting || initialSubmitDisabled;

    const draftLoading = draftSaveResponse && isLoading(draftSaveResponse);
    const draftSaved = draftSaveResponse && isSuccess(draftSaveResponse);

    const isSomeButtonInLoading = submitting || draftLoading;

    return (
        <>
            {FormFooterComponent ? (
                <FormFooterComponent submitting={submitting} submitDisabled={submitDisabled} onCancel={onCancel} />
            ) : (
                <S.Footer className={className} style={style}>
                    <RenderDraftButton
                        assembledFromQuestionnaireId={assembledFromQuestionnaireId}
                        setDraftSaveResponse={setDraftSaveResponse}
                        saveDraft={saveDraft}
                        autoSave={autoSave}
                        draftLoading={draftLoading}
                        draftSaved={draftSaved}
                        formValues={formValues}
                        isSomeButtonInLoading={isSomeButtonInLoading}
                    />
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

interface RenderDraftButtonProps {
    assembledFromQuestionnaireId: string | undefined;
    setDraftSaveResponse?: (data: RemoteData<WithId<QuestionnaireResponse>>) => void;
    saveDraft?: (currentFormValues: FormItems) => Promise<void>;
    autoSave?: boolean;
    draftLoading?: boolean;
    draftSaved?: boolean;
    formValues?: FormItems;
    isSomeButtonInLoading?: boolean;
}

export function RenderDraftButton(props: RenderDraftButtonProps) {
    const { draftLoading, draftSaved, formValues, isSomeButtonInLoading } = props;

    const { saveDraft, autoSave, questionnaireId, setDraftSaveResponse } = useSaveDraft({
        debounceTimeout: 1000,
    });

    if (!formValues) {
        return null;
    }

    if (!questionnaireId) {
        return null;
    }

    if (!setDraftSaveResponse || !saveDraft) {
        return null;
    }

    if (!autoSave) {
        return (
            <Button loading={draftLoading} disabled={isSomeButtonInLoading} onClick={() => saveDraft(formValues)}>
                <Trans>Save as draft</Trans>
            </Button>
        );
    }

    if (autoSave && draftLoading) {
        return (
            <Button type="ghost" disabled loading={draftLoading}>
                <Trans>Saving draft</Trans>
            </Button>
        );
    }

    if (autoSave && draftSaved) {
        return (
            <Button type="ghost" disabled icon={<CheckOutlined />}>
                <span>
                    <Trans>Saved as draft</Trans>
                </span>
            </Button>
        );
    }

    return null;
}
