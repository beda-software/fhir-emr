import { t } from '@lingui/macro';
import { useContext } from 'react';

import { BaseQuestionnaireResponseFormPropsContext } from 'src/components/BaseQuestionnaireResponseForm/context';
import { FormFooter, FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';

import { S } from './styles';

export interface QuestionnairesWizardFooterProps extends FormFooterComponentProps {
    goBack: () => void;
    goForward: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    canComplete: boolean;
    nextButtonTitle?: React.ReactNode;
    finishButtonTitle?: React.ReactNode;
}

export function QuestionnairesWizardFooter(props: QuestionnairesWizardFooterProps) {
    const {
        goBack,
        goForward,
        submitting,
        submitDisabled,
        canGoBack,
        canGoForward,
        canComplete,
        nextButtonTitle,
        finishButtonTitle,
        onCancel,
    } = props;

    const baseQRFPropsContext = useContext(BaseQuestionnaireResponseFormPropsContext);

    return (
        <>
            <S.Footer goBack={goBack} goForward={goForward} canGoBack={canGoBack} canGoForward={canGoForward}>
                {baseQRFPropsContext && baseQRFPropsContext.formData && (
                    <FormFooter
                        submitting={submitting}
                        submitDisabled={submitDisabled}
                        onCancel={onCancel}
                        formData={baseQRFPropsContext.formData}
                        saveButtonTitle={
                            canComplete ? finishButtonTitle || t`Complete` : nextButtonTitle || t`Submit and Go Forward`
                        }
                    />
                )}
            </S.Footer>
        </>
    );
}
