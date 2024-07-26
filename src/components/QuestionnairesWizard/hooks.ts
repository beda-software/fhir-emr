import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';

import {
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
} from 'src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseFormProps } from '../BaseQuestionnaireResponseForm';
import { FormFooterComponentProps } from '../BaseQuestionnaireResponseForm/FormFooter';

export interface QuestionnairesWizardFooterProps extends FormFooterComponentProps {
    goBack: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    prevButtonTitle?: React.ReactNode;
    nextButtonTitle?: React.ReactNode;
    finishButtonTitle?: React.ReactNode;
}

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
}

export function useQuestionnairesWizard(props: QuestionnairesWizardProps) {
    const {
        questionnaires,
        questionnaireResponses: initialQuestionnaireResponses,
        initialQuestionnaireId,
        onQuestionnaireChange,
    } = props;
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

    useEffect(() => {
        onQuestionnaireChange?.(questionnaires[currentQuestionnaireIndex]!, currentQuestionnaireIndex);
    }, [currentQuestionnaireIndex]);

    return {
        currentQuestionnaire,
        currentQuestionnaireIndex,
        setCurrentQuestionnaireIndex,
        currentQuestionnaireResponse,
        setQuestionnaireResponses,
        canGoBack,
        canGoForward,
    };
}
