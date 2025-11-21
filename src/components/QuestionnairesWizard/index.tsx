import { FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';
import { QuestionnaireResponseFormDraft } from 'src/components/QuestionnaireResponseFormDraft';
import { Wizard } from 'src/components/Wizard';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { QuestionnairesWizardFooter } from './components/QuestionnairesWizardFooter';
import { QuestionnairesWizardProps, useQuestionnairesWizard } from './hooks';

export { QuestionnairesWizardFooter } from './components/QuestionnairesWizardFooter';

export function QuestionnairesWizard(props: QuestionnairesWizardProps) {
    const { onSuccess, onStepSuccess, initialQuestionnaireResponse, FormFooterComponent, ...other } = props;

    const {
        currentQuestionnaire,
        currentQuestionnaireIndex,
        setCurrentQuestionnaireIndex,
        currentQuestionnaireResponse,
        setQuestionnaireResponses,
        canGoBack,
        canGoForward,
        canComplete,
        checkOtherQuestionnaireResponsesValid,
        setStepStatus,
        stepsItems,
        handleCancel,
    } = useQuestionnairesWizard(props);

    return (
        <Wizard
            currentIndex={currentQuestionnaireIndex}
            items={stepsItems}
            onChange={setCurrentQuestionnaireIndex}
            {...props.wizard}
        >
            <QuestionnaireResponseFormDraft
                key={currentQuestionnaire?.id}
                autoSave
                qrDraftServiceType="local"
                subject={props.patient!}
                questionnaireId={currentQuestionnaire!.id!}
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

                    if (!canComplete) {
                        setCurrentQuestionnaireIndex(currentQuestionnaireIndex + 1);
                    } else if (checkOtherQuestionnaireResponsesValid(currentQuestionnaireIndex)) {
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
                FormFooterComponent={(passedProps: FormFooterComponentProps) => {
                    const footerProps = {
                        ...passedProps,
                        goBack: () => {
                            setCurrentQuestionnaireIndex(currentQuestionnaireIndex - 1);
                        },
                        goForward: () => {
                            setCurrentQuestionnaireIndex(currentQuestionnaireIndex + 1);
                        },
                        canGoBack,
                        canGoForward,
                        canComplete,
                        onCancel: handleCancel,
                    };

                    if (FormFooterComponent) {
                        return <FormFooterComponent {...footerProps} />;
                    }

                    return <QuestionnairesWizardFooter {...footerProps} />;
                }}
                launchContextParameters={props.launchContextParameters}
                {...other}
            />
        </Wizard>
    );
}
