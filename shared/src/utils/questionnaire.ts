import { QuestionnaireItemAnswerOption, QuestionnaireResponseItemAnswer } from '../contrib/aidbox';

export function getAnswerDisplay(
    value: QuestionnaireItemAnswerOption['value'] | QuestionnaireResponseItemAnswer['value'],
) {
    if (value?.Coding) {
        return value.Coding.display!;
    }
    if (value?.string) {
        return value.string;
    }

    if (value?.Reference) {
        return value.Reference.display ?? '';
    }

    return JSON.stringify(value);
}

export function getAnswerCode(
    o: QuestionnaireItemAnswerOption['value'] | QuestionnaireResponseItemAnswer['value'],
) {
    if (o?.Coding) {
        return o.Coding.code!;
    }
    if (o?.string) {
        return o.string;
    }

    if (o?.Reference) {
        return o.Reference.id;
    }

    return JSON.stringify(o);
}
