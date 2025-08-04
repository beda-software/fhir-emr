import { FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';
import { FormHeaderComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormHeader';
import { S as WizardS } from 'src/components/Wizard/styles';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { QuestionnairesWizardFooter } from './components/QuestionnairesWizardFooter';
import { QuestionnairesWizardHeader } from './components/QuestionnairesWizardHeader';
import { QuestionnairesWizardProps, useQuestionnairesWizard } from './hooks';
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
        otherQuestionnaireResponsesValid,
        overrideNextQuestionnaireIndex,
        setOverrideNextQuestionnaireIndex,
        mappedItems,
        setStepStatus,
        handleStepChange,
    } = useQuestionnairesWizard(props);

    return (
        <WizardS.Container $labelPlacement="vertical">
            <QuestionnaireResponseForm
                key={currentQuestionnaire?.id}
                questionnaireLoader={questionnaireIdLoader(currentQuestionnaire!.id!)}
                onSuccess={(result) => {
                    setStepStatus(currentQuestionnaireIndex, 'finish');
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

                    if (overrideNextQuestionnaireIndex.current !== null) {
                        setCurrentQuestionnaireIndex(overrideNextQuestionnaireIndex.current);
                        overrideNextQuestionnaireIndex.current = null;
                    } else if (canGoForward) {
                        setCurrentQuestionnaireIndex(currentQuestionnaireIndex + 1);
                    } else if (otherQuestionnaireResponsesValid(currentQuestionnaireIndex)) {
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
                FormHeaderComponent={(passedProps: FormHeaderComponentProps) => {
                    const headerProps = {
                        ...passedProps,
                    };
                    return (
                        <QuestionnairesWizardHeader
                            {...headerProps}
                            title={currentQuestionnaire?.title ?? ''}
                            index={currentQuestionnaireIndex}
                            total={questionnaires.length}
                            currentQuestionnaireIndex={currentQuestionnaireIndex}
                            mappedItems={mappedItems}
                            handleStepChange={handleStepChange}
                        />
                    );
                }}
                FormFooterComponent={(passedProps: FormFooterComponentProps) => {
                    const footerProps = {
                        ...passedProps,
                        goBack: () => {
                            if (canGoBack) {
                                setCurrentQuestionnaireIndex(currentQuestionnaireIndex - 1);
                                setOverrideNextQuestionnaireIndex(null);
                            }
                        },
                        canGoBack,
                        canGoForward,
                        prevButtonTitle: canGoBack ? questionnaires[currentQuestionnaireIndex - 1]?.title : undefined,
                        nextButtonTitle: canGoForward
                            ? questionnaires[currentQuestionnaireIndex + 1]?.title
                            : undefined,
                        currentQuestionnaireIndex,
                        handleStepChange,
                    };

                    if (FormFooterComponent) {
                        return <FormFooterComponent {...footerProps} />;
                    }

                    return <QuestionnairesWizardFooter {...footerProps} />;
                }}
                launchContextParameters={props.launchContextParameters}
                {...other}
            />
        </WizardS.Container>
    );
}
