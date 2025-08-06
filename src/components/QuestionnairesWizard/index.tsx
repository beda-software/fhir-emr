import { QuestionnaireResponse } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';
import { QuestionnaireResponseFormDraft } from 'src/components/QuestionnaireResponseFormDraft';
import { S as WizardS } from 'src/components/Wizard/styles';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';

import { QuestionnairesWizardFooter } from './components/QuestionnairesWizardFooter';
import { QuestionnairesWizardHeaderSteps } from './components/QuestionnairesWizardHeader';
import { QuestionnairesWizardProps, useQuestionnairesWizard } from './hooks';

export { QuestionnairesWizardHeaderSteps, QuestionnairesWizardHeader } from './components/QuestionnairesWizardHeader';
export { QuestionnairesWizardFooter } from './components/QuestionnairesWizardFooter';

export function QuestionnairesWizard(props: QuestionnairesWizardProps) {
    const {
        onSuccess,
        onStepSuccess,
        initialQuestionnaireResponse,
        FormFooterComponent,
        FormHeaderComponent,
        ...other
    } = props;

    const {
        currentQuestionnaire,
        currentQuestionnaireIndex,
        setCurrentQuestionnaireIndex,
        currentQuestionnaireResponse,
        setQuestionnaireResponses,
        canGoBack,
        canGoForward,
        checkOtherQuestionnaireResponsesValid,
        setStepStatus,
        headerProps,
    } = useQuestionnairesWizard(props);

    return (
        <WizardS.Container $labelPlacement="vertical">
            {FormHeaderComponent ? (
                <FormHeaderComponent {...headerProps} />
            ) : (
                <QuestionnairesWizardHeaderSteps {...headerProps} />
            )}
            <QuestionnaireResponseFormDraft
                key={currentQuestionnaire?.id}
                subject={props.patient!}
                questionnaireId={currentQuestionnaire!.id!}
                questionnaireResponse={
                    currentQuestionnaireResponse && currentQuestionnaireResponse.id
                        ? (currentQuestionnaireResponse as WithId<QuestionnaireResponse>)
                        : undefined
                }
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

                    if (canGoForward) {
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
                        canGoBack,
                        canGoForward,
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
