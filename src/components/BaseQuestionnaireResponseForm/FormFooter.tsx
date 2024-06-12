import { Trans } from '@lingui/macro';
import { Button } from 'antd';

import { QuestionnaireResponseFormSaveResponse } from 'shared/src/hooks/questionnaire-response-form-data';

import { S } from './BaseQuestionnaireResponseForm.styles';

export interface FormFooterComponentProps {
    submitting: boolean;
    submitDisabled?: boolean;
    onCancel?: () => void;
}

export interface Props {
    onCancel?: () => void;
    onSuccess?: (data: QuestionnaireResponseFormSaveResponse) => Promise<any> | void;
    onFailure?: (error: any) => Promise<any> | void;

    submitting: boolean;
    readOnly?: boolean;

    FormFooterComponent?: React.ElementType<FormFooterComponentProps>;
    saveButtonTitle?: string;
    cancelButtonTitle?: string;
}

export function FormFooter(props: Props) {
    const { readOnly, onCancel, FormFooterComponent, saveButtonTitle, cancelButtonTitle, submitting } = props;
    const submitDisabled = submitting;

    if (readOnly) {
        return null;
    }

    return (
        <>
            {FormFooterComponent ? (
                <FormFooterComponent submitting={submitting} submitDisabled={submitDisabled} onCancel={onCancel} />
            ) : (
                <S.Footer>
                    {onCancel && (
                        <Button type="default" onClick={onCancel} data-testid="cancel-button">
                            {cancelButtonTitle ?? <Trans>Cancel</Trans>}
                        </Button>
                    )}
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        data-testid="submit-button"
                        disabled={submitDisabled}
                    >
                        {saveButtonTitle ?? <Trans>Save</Trans>}
                    </Button>
                </S.Footer>
            )}
        </>
    );
}
