import { t } from '@lingui/macro';
import { notification, StepProps, StepsProps } from 'antd';
import { Patient, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { QuestionnairesWizardFooterProps } from 'src/components/QuestionnairesWizard/components/QuestionnairesWizardFooter';
import { WizardItem, WizardProps } from 'src/components/Wizard';
import {
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
} from 'src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseFormProps } from '../BaseQuestionnaireResponseForm';

export interface QuestionnairesWizardProps
    extends Omit<BaseQuestionnaireResponseFormProps, 'formData' | 'FormFooterComponent'>,
        Omit<QuestionnaireResponseFormProps, 'questionnaireLoader'> {
    onSuccess?: (response: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: any) => void;
    onStepSuccess?: (response: QuestionnaireResponseFormSaveResponse) => void;

    FormFooterComponent?: React.ElementType<QuestionnairesWizardFooterProps>;

    questionnaires: Questionnaire[];
    questionnaireResponses: QuestionnaireResponse[];
    initialQuestionnaireId?: string;
    onQuestionnaireChange?: (q: Questionnaire, index: number) => void;
    patient?: Patient;
    wizard?: Partial<WizardProps>;
    disableWaitStepsNavigation?: boolean;
}

export function useQuestionnairesWizard(props: QuestionnairesWizardProps) {
    const {
        questionnaires,
        questionnaireResponses: initialQuestionnaireResponses,
        initialQuestionnaireId,
        onQuestionnaireChange,
        onCancel,
        disableWaitStepsNavigation,
    } = props;

    const navigate = useNavigate();

    const [stepsStatuses, setStepsStatuses] = useState<StepsProps['status'][]>(
        questionnaires.map((q, index) => {
            const defaultIndex = initialQuestionnaireId
                ? questionnaires.findIndex((q) => q.id === initialQuestionnaireId)
                : 0;

            if (initialQuestionnaireResponses.some((qr) => qr.questionnaire === q.id)) {
                return 'finish';
            }

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

    const setStepStatus = useCallback((index: number, status: StepProps['status']) => {
        setStepsStatuses((prev) => {
            const newStepsStatuses = [...prev];
            newStepsStatuses[index] = status;
            return newStepsStatuses;
        });
    }, []);

    const checkOtherQuestionnaireResponsesValid = useCallback(
        (exceptQuestionnaireIndex: number) => {
            if (questionnaireResponses.length === stepsStatuses.length) {
                return true;
            }

            const unfinishedSteps = questionnaires.filter(
                (q) =>
                    !questionnaireResponses.some((qr) => qr.questionnaire === q.id) &&
                    q.id !== questionnaires[exceptQuestionnaireIndex]?.id,
            );

            if (unfinishedSteps.length === 0) {
                return true;
            }

            unfinishedSteps.forEach((step) => {
                const index = questionnaires.findIndex((q) => q.id === step.id);
                notification.error({
                    message: t`${questionnaires[index]?.title} was not submitted`,
                });
            });

            setStepsStatuses((prev) => {
                const newStepsStatuses = [...prev];
                unfinishedSteps.forEach((step) => {
                    const index = questionnaires.findIndex((q) => q.id === step.id);
                    newStepsStatuses[index] = 'error';
                });
                return newStepsStatuses;
            });

            return false;
        },
        [questionnaireResponses, questionnaires, stepsStatuses.length],
    );

    const isStepDisabled = useCallback(
        (index: number) => {
            return index > currentQuestionnaireIndex && stepsStatuses[index] === 'wait';
        },
        [currentQuestionnaireIndex, stepsStatuses],
    );

    const stepsItems: WizardItem[] = useMemo(() => {
        return questionnaires.map((q, index) => {
            return {
                title: q.title,
                linkId: q.item?.[0]?.linkId ?? '',
                status: stepsStatuses[index],
                disabled: disableWaitStepsNavigation ? isStepDisabled(index) : false,
            };
        });
    }, [disableWaitStepsNavigation, isStepDisabled, questionnaires, stepsStatuses]);

    const handleCancel = useCallback(() => {
        onCancel ? onCancel() : navigate(-1);
    }, [navigate, onCancel]);

    const enableStep = useCallback(
        (index: number) => {
            if (stepsStatuses[index] === 'wait') {
                setStepStatus(index, 'process');
            }
        },
        [setStepStatus, stepsStatuses],
    );

    useEffect(() => {
        onQuestionnaireChange?.(questionnaires[currentQuestionnaireIndex]!, currentQuestionnaireIndex);
        enableStep(currentQuestionnaireIndex);
    }, [currentQuestionnaireIndex, enableStep, onQuestionnaireChange, questionnaires, setStepStatus]);

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
        stepsItems,
        handleCancel,
    };
}
