import { CheckOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { CSSProperties } from 'react';
import { useWatch } from 'react-hook-form';
import { FormItems } from 'sdc-qrf';

import { isLoading, isSuccess } from '@beda.software/remote-data';

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

    const submitLoading = submitting;
    const submitDisabled = submitting || initialSubmitDisabled;

    const draftLoading = draftSaveResponse && isLoading(draftSaveResponse);
    const draftSaved = draftSaveResponse && isSuccess(draftSaveResponse);

    const isSomeButtonInLoading = submitLoading || draftLoading;

    const renderDraftButton = () => {
        if (!assembledFromQuestionnaireId) {
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
    };

    return (
        <>
            {FormFooterComponent ? (
                <FormFooterComponent submitting={submitting} submitDisabled={submitDisabled} onCancel={onCancel} />
            ) : (
                <S.Footer className={className} style={style}>
                    {renderDraftButton()}
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
                        loading={submitLoading}
                        disabled={submitDisabled || isSomeButtonInLoading}
                    >
                        {saveButtonTitle ?? <Trans>Save</Trans>}
                    </Button>
                </S.Footer>
            )}
        </>
    );
}
