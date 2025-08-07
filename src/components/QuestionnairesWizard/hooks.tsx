import { Button, notification, StepProps, StepsProps } from 'antd';
import { Patient, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { QuestionnairesWizardFooterProps } from 'src/components/QuestionnairesWizard/components/QuestionnairesWizardFooter';
import {
    QuestionnairesWizardHeaderProps,
    QuestionnairesWizardHeaderStepsProps,
} from 'src/components/QuestionnairesWizard/components/QuestionnairesWizardHeader';
import {
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
} from 'src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseFormProps } from '../BaseQuestionnaireResponseForm';

export interface QuestionnairesWizardProps
    extends Omit<BaseQuestionnaireResponseFormProps, 'formData' | 'FormFooterComponent' | 'FormHeaderComponent'>,
        Omit<QuestionnaireResponseFormProps, 'questionnaireLoader'> {
    onSuccess?: (response: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: any) => void;
    onStepSuccess?: (response: QuestionnaireResponseFormSaveResponse) => void;

    FormFooterComponent?: React.ElementType<QuestionnairesWizardFooterProps>;
    FormHeaderComponent?: React.ElementType<QuestionnairesWizardHeaderProps>;

    questionnaires: Questionnaire[];
    questionnaireResponses: QuestionnaireResponse[];
    initialQuestionnaireId?: string;
    onQuestionnaireChange?: (q: Questionnaire, index: number) => void;
    patient?: Patient;
}

export function useQuestionnairesWizard(props: QuestionnairesWizardProps) {
    const {
        questionnaires,
        questionnaireResponses: initialQuestionnaireResponses,
        initialQuestionnaireId,
        onQuestionnaireChange,
    } = props;

    const [stepsStatuses, setStepsStatuses] = useState<StepsProps['status'][]>(
        questionnaires.map((q, index) => {
            const defaultIndex = initialQuestionnaireId
                ? questionnaires.findIndex((q) => q.id === initialQuestionnaireId)
                : 0;
            if (index === defaultIndex) {
                return 'process';
            }
            return 'wait';
        }),
    );
    const [questionnaireResponses, setQuestionnaireResponses] = useState(initialQuestionnaireResponses);
    const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(
        initialQuestionnaireId ? questionnaires.findIndex((q) => q.id === initialQuestionnaireId) : 0,
    );

    const currentQuestionnaire = questionnaires[currentQuestionnaireIndex];
    const currentQuestionnaireResponse = questionnaireResponses.find(
        (qr) => qr.questionnaire === currentQuestionnaire?.id,
    );

    const canGoBack = currentQuestionnaireIndex > 0;
    const canGoForward = currentQuestionnaireIndex + 1 < questionnaires.length;

    const buttonColor = useCallback((status: StepsProps['status']) => {
        if (status === 'error') {
            return 'danger';
        }
        if (status === 'wait') {
            return 'default';
        }
        return 'primary';
    }, []);

    const stepButtons = useMemo(() => {
        return questionnaires.map((_, index) => {
            return (
                <Button
                    key={index}
                    htmlType={index === currentQuestionnaireIndex ? 'button' : 'submit'}
                    shape="circle"
                    type="default"
                    color={buttonColor(stepsStatuses[index])}
                    variant={index === currentQuestionnaireIndex ? 'solid' : 'outlined'}
                >{`${index + 1}`}</Button>
            );
        });
    }, [questionnaires, currentQuestionnaireIndex, buttonColor, stepsStatuses]);

    const mappedItems: StepProps[] = useMemo(() => {
        return questionnaires.map((q, index) => {
            return {
                icon: stepButtons[index],
                status: stepsStatuses[index],
                title: q.title,
                key: q.item?.[0]?.linkId ?? '',
            };
        });
    }, [questionnaires, stepButtons, stepsStatuses]);

    const setStepStatus = useCallback((index: number, status: StepProps['status']) => {
        setStepsStatuses((prev) => {
            const newStepsStatuses = [...prev];
            newStepsStatuses[index] = status;
            return newStepsStatuses;
        });
    }, []);

    const checkOtherQuestionnaireResponsesValid = useCallback(
        (exceptQuestionnaireIndex: number) => {
            const invalidSteps = stepsStatuses
                .filter((_, index) => index !== exceptQuestionnaireIndex)
                .filter((status) => status !== 'finish')
                .map((status, index) => {
                    return {
                        status,
                        index,
                    };
                });

            if (invalidSteps.length === 0) {
                return true;
            }

            invalidSteps.forEach((step) => {
                notification.error({
                    message: `${questionnaires[step.index]?.title} was not submitted`,
                });
            });

            setStepsStatuses((prev) => {
                const newStepsStatuses = [...prev];
                invalidSteps.forEach((step) => {
                    newStepsStatuses[step.index] = 'error';
                });
                return newStepsStatuses;
            });

            return false;
        },
        [questionnaires, stepsStatuses],
    );

    const headerProps = useMemo<QuestionnairesWizardHeaderStepsProps & QuestionnairesWizardHeaderProps>(() => {
        return {
            title: questionnaires[currentQuestionnaireIndex]?.title ?? '',
            index: currentQuestionnaireIndex,
            total: questionnaires.length,
            mappedItems,
            handleStepChange: (nextStep: number) => {
                setCurrentQuestionnaireIndex(nextStep);
            },
        };
    }, [currentQuestionnaireIndex, mappedItems, questionnaires]);

    useEffect(() => {
        onQuestionnaireChange?.(questionnaires[currentQuestionnaireIndex]!, currentQuestionnaireIndex);
        setStepStatus(currentQuestionnaireIndex, 'process');
    }, [currentQuestionnaireIndex, onQuestionnaireChange, questionnaires, setStepStatus]);

    return {
        currentQuestionnaire,
        currentQuestionnaireIndex,
        setCurrentQuestionnaireIndex,
        currentQuestionnaireResponse,
        questionnaireResponses,
        setQuestionnaireResponses,
        canGoBack,
        canGoForward,
        checkOtherQuestionnaireResponsesValid,
        setStepStatus,
        headerProps,
    };
}
