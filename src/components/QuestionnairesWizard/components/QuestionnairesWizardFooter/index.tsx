import { t } from '@lingui/macro';
import { Button } from 'antd';

import { FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';

import { S } from './styles';

export interface QuestionnairesWizardFooterProps extends FormFooterComponentProps {
    goBack: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    prevButtonTitle?: React.ReactNode;
    nextButtonTitle?: React.ReactNode;
    finishButtonTitle?: React.ReactNode;
}

export function QuestionnairesWizardFooter(props: QuestionnairesWizardFooterProps) {
    const {
        goBack,
        submitting,
        submitDisabled,
        canGoBack,
        canGoForward,
        prevButtonTitle,
        nextButtonTitle,
        finishButtonTitle,
    } = props;

    return (
        <>
            <S.Footer>
                {canGoBack ? (
                    <Button type="default" disabled={submitDisabled} onClick={goBack}>
                        {prevButtonTitle || t`Go Back`}
                    </Button>
                ) : (
                    <div />
                )}
                <Button type="primary" htmlType="submit" loading={submitting} disabled={submitDisabled}>
                    {canGoForward ? nextButtonTitle || t`Submit and Go Forward` : finishButtonTitle || t`Complete`}
                </Button>
            </S.Footer>
        </>
    );
}
