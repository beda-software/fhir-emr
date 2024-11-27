import { CheckOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { DebouncedFunc } from 'lodash';
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
    debouncedSaveDraft?: DebouncedFunc<(currentFormValues: FormItems) => Promise<void>>;
    className?: string | undefined;
    style?: CSSProperties | undefined;
}

export function FormFooter(props: Props) {
    const {
        readOnly,
        onCancel,
        FormFooterComponent,
        saveButtonTitle,
        cancelButtonTitle,
        submitting,
        debouncedSaveDraft,
        autoSave,
        draftSaveResponse,
        setDraftSaveResponse,
        className,
        style,
    } = props;

    const formValues = useWatch();

    if (readOnly) {
        return null;
    }

    const submitLoading = submitting;
    const submitDisabled = submitting;

    const draftLoading = draftSaveResponse && isLoading(draftSaveResponse);
    const draftSaved = draftSaveResponse && isSuccess(draftSaveResponse);
    const draftDisabled = draftSaveResponse && isLoading(draftSaveResponse);

    const renderDraftButton = () => {
        if (!setDraftSaveResponse || !debouncedSaveDraft) {
            return null;
        }

        if (!autoSave) {
            return (
                <Button
                    loading={draftLoading}
                    disabled={draftDisabled || submitLoading}
                    onClick={() => debouncedSaveDraft(formValues)}
                >
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
                        <Button type="default" onClick={onCancel} data-testid="cancel-button">
                            {cancelButtonTitle ?? <Trans>Cancel</Trans>}
                        </Button>
                    )}
                    <Button
                        type="primary"
                        htmlType="submit"
                        data-testid="submit-button"
                        loading={submitLoading}
                        disabled={submitDisabled || draftLoading}
                    >
                        {saveButtonTitle ?? <Trans>Save</Trans>}
                    </Button>
                </S.Footer>
            )}
        </>
    );
}
