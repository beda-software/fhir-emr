import { QuestionnaireItemAnswerOption, QuestionnaireResponseItemAnswer } from '../contrib/aidbox';

export function getAnswerDisplay(
    o: QuestionnaireItemAnswerOption['value'] | QuestionnaireResponseItemAnswer['value'],
) {
    if (o?.Coding) {
        return o.Coding.display!;
    }
    if (o?.string) {
        return o.string;
    }

    if (o?.Reference) {
        return o.Reference.display ?? '';
    }

    return JSON.stringify(o);
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
