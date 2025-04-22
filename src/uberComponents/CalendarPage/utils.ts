import { QuestionnaireActionType } from '../ResourceListPage/actions';

export const calendarQuestionnaireActionConstructor = (
    actionData: Omit<QuestionnaireActionType, 'type'>,
): QuestionnaireActionType => ({
    type: 'questionnaire',
    ...actionData,
});
