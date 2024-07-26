import { Trans } from '@lingui/macro';
import { Button } from 'antd';

import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { QuestionnairesWizardFooterProps, QuestionnairesWizardProps, useQuestionnairesWizard } from './hooks';
import { S } from './QuestionnairesWizard.styles';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export function QuestionnairesWizard(props: QuestionnairesWizardProps) {
    const { onSuccess, onStepSuccess, questionnaires, initialQuestionnaireResponse, FormFooterComponent, ...other } =
        props;

    const {
        currentQuestionnaire,
        currentQuestionnaireIndex,
        setCurrentQuestionnaireIndex,
        currentQuestionnaireResponse,
        setQuestionnaireResponses,
        canGoBack,
        canGoForward,
    } = useQuestionnairesWizard(props);

    return (
        <QuestionnaireResponseForm
            key={currentQuestionnaire?.id}
            questionnaireLoader={questionnaireIdLoader(currentQuestionnaire!.id!)}
            onSuccess={(result) => {
                setQuestionnaireResponses((qrList) => {
                    const filledQIds = qrList.map((qr) => qr.questionnaire);
                    const questionnaireId = result.questionnaireResponse.questionnaire;

                    if (questionnaireId && filledQIds.includes(questionnaireId)) {
                        return qrList.map((qr) => {
                            if (qr.questionnaire === questionnaireId) {
                                return result.questionnaireResponse;
                            } else {
                                return qr;
                            }
                        });
                    }

                    return [...qrList, result.questionnaireResponse];
                });

                onStepSuccess?.(result);

                if (canGoForward) {
                    setCurrentQuestionnaireIndex(currentQuestionnaireIndex + 1);
                } else {
                    onSuccess?.(result);
                }
            }}
            initialQuestionnaireResponse={
                currentQuestionnaireResponse || {
                    ...initialQuestionnaireResponse,
                    resourceType: 'QuestionnaireResponse',
                    questionnaire: currentQuestionnaire?.id,
                }
            }
            FormFooterComponent={(passedProps) => {
                const footerProps = {
                    ...passedProps,
                    goBack: () => {
                        if (canGoBack) {
                            setCurrentQuestionnaireIndex(currentQuestionnaireIndex - 1);
                        }
                    },
                    canGoBack,
                    canGoForward,
                    prevButtonTitle: canGoBack ? questionnaires[currentQuestionnaireIndex - 1]?.title : undefined,
                    nextButtonTitle: canGoForward ? questionnaires[currentQuestionnaireIndex + 1]?.title : undefined,
                };

                if (FormFooterComponent) {
                    return <FormFooterComponent {...footerProps} />;
                }

                return <QuestionnairesWizardFooter {...footerProps} />;
            }}
            {...other}
        />
    );
}

export function QuestionnairesWizardFooter(props: QuestionnairesWizardFooterProps) {
    const {
        submitting,
        submitDisabled,
        canGoBack,
        canGoForward,
        goBack,
        prevButtonTitle,
        nextButtonTitle,
        finishButtonTitle,
    } = props;

    return (
        <S.Footer>
            {canGoBack ? (
                <Button type="default" onClick={goBack}>
                    {prevButtonTitle || <Trans>Go Back</Trans>}
                </Button>
            ) : (
                <div />
            )}
            <Button type="primary" htmlType="submit" loading={submitting} disabled={submitDisabled}>
                {canGoForward
                    ? nextButtonTitle || <Trans>Go Forward</Trans>
                    : finishButtonTitle || <Trans>Complete</Trans>}
            </Button>
        </S.Footer>
    );
}

export interface QuestionnairesWizardHeaderProps {
    title: string;
    index: number;
    total: number;
}

export function QuestionnairesWizardHeader(props: QuestionnairesWizardHeaderProps) {
    const { title, index, total } = props;

    return (
        <S.Header>
            <S.Count>{`${index + 1}/${total}`}</S.Count> {title}
        </S.Header>
    );
}
