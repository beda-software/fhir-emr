import { t } from '@lingui/macro';
import { Button } from 'antd';
import { useFormContext } from 'react-hook-form';

import { FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';

import { S } from './styles';

export interface QuestionnairesWizardFooterProps extends FormFooterComponentProps {
    goBack: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    prevButtonTitle?: React.ReactNode;
    nextButtonTitle?: React.ReactNode;
    finishButtonTitle?: React.ReactNode;
    currentQuestionnaireIndex?: number;
    handleStepChange?: (nextStep: number, currentFormValid: boolean) => void;
}

export function QuestionnairesWizardFooter(props: QuestionnairesWizardFooterProps) {
    const {
        submitting,
        submitDisabled,
        canGoBack,
        canGoForward,
        prevButtonTitle,
        nextButtonTitle,
        finishButtonTitle,
        currentQuestionnaireIndex,
        handleStepChange,
    } = props;

    const { trigger } = useFormContext();

    return (
        <>
            <S.Footer>
                {canGoBack ? (
                    <Button type="default" htmlType="submit" disabled={submitDisabled}>
                        <div
                            onClick={async () => {
                                const result = await trigger();
                                if (handleStepChange && currentQuestionnaireIndex !== undefined) {
                                    handleStepChange(currentQuestionnaireIndex - 1, result);
                                }
                            }}
                        >
                            {prevButtonTitle || t`Go Back`}
                        </div>
                    </Button>
                ) : (
                    <div />
                )}
                <Button type="primary" htmlType="submit" loading={submitting} disabled={submitDisabled}>
                    <div
                        onClick={async () => {
                            const result = await trigger();
                            if (handleStepChange && currentQuestionnaireIndex !== undefined) {
                                handleStepChange(currentQuestionnaireIndex + 1, result);
                            }
                        }}
                    >
                        {canGoForward ? nextButtonTitle || t`Go Forward` : finishButtonTitle || t`Complete`}
                    </div>
                </Button>
            </S.Footer>
        </>
    );
}
