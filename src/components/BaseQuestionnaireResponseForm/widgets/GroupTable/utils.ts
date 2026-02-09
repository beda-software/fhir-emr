import { QuestionnaireItem } from 'fhir/r4b';
import { AnswerValue, FormAnswerItems, FormGroupItems, getAnswerValues } from 'sdc-qrf';

export const isFormAnswerItems = (
    item: FormGroupItems | (FormAnswerItems | undefined)[] | undefined,
): item is FormAnswerItems[] => {
    return Array.isArray(item) && item.every((item) => item !== undefined && item !== null && 'value' in item);
};

const getValueFromAnswerValue = (answerValue: AnswerValue, questionnaireItemType: QuestionnaireItem['type']) => {
    switch (questionnaireItemType) {
        case 'string':
            return answerValue.string;
        case 'boolean':
            return answerValue.boolean;
        case 'date':
            return answerValue.date;
        case 'dateTime':
            return answerValue.dateTime;
        case 'decimal':
            return answerValue.decimal;
        case 'integer':
            return answerValue.integer;
        case 'time':
            return answerValue.time;
        case 'text':
            return answerValue.string;
        case 'choice':
            return answerValue.Coding?.code;
        case 'open-choice':
            return answerValue.Coding?.code;
        case 'attachment':
            return answerValue.Attachment?.title;
        case 'reference':
            return answerValue.Reference?.display;
        case 'quantity':
            return answerValue.Quantity?.value;
        default:
            return '-';
    }
};

export const getFormAnswerItemFirstValue = (
    FormAnswerItem: FormAnswerItems[],
    questionnaireItemType: QuestionnaireItem['type'],
) => {
    const answerValues = getAnswerValues(FormAnswerItem);
    if (!answerValues[0]) {
        return null;
    }
    const firstValue = answerValues[0];
    return getValueFromAnswerValue(firstValue, questionnaireItemType);
};
