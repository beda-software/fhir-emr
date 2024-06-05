import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';

import {
    QuestionnaireResponseFormProps,
    questionnaireIdLoader,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseFormProps } from 'src/components/BaseQuestionnaireResponseForm';

import { useQuestionnairesWizard } from './hooks';
import { S } from './QuestionnairesWizard.styles';
import { FormFooterComponentProps } from '../BaseQuestionnaireResponseForm/FormFooter';
import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

interface WizardProps
    extends Omit<BaseQuestionnaireResponseFormProps, 'formData'>,
        Omit<QuestionnaireResponseFormProps, 'questionnaireLoader'> {
    onSuccess?: (resource: any) => void;
    onFailure?: (error: any) => void;

    questionnaires: Questionnaire[];
    questionnaireResponses: QuestionnaireResponse[];
    initialQuestionnaireId?: string;
    onQuestionnaireChange?: (q: Questionnaire, index: number) => void;
}

export function QuestionnairesWizard(props: WizardProps) {
    const { onSuccess, questionnaires, initialQuestionnaireResponse, FormFooterComponent, ...other } = props;

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
            onSuccess={(result: { questionnaireResponse: QuestionnaireResponse }) => {
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
                };

                if (FormFooterComponent) {
                    return <FormFooterComponent {...footerProps} />;
                }

                return (
                    <QuestionnairesWizardFooter
                        {...footerProps}
                        prevButtonTitle={canGoBack ? questionnaires[currentQuestionnaireIndex - 1]?.title : undefined}
                        nextButtonTitle={
                            canGoForward ? questionnaires[currentQuestionnaireIndex + 1]?.title : undefined
                        }
                        finishButtonTitle={<Trans>Completar</Trans>}
                    />
                );
            }}
            {...other}
        />
    );
}

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
