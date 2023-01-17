import {
    QuestionnaireItemAnswerOption,
    QuestionnaireItemAnswerOptionValue,
} from 'shared/src/contrib/aidbox';

export function getDisplay(value?: QuestionnaireItemAnswerOptionValue): string | number | null {
    if (!value) {
        return null;
    }

    if (value.Coding) {
        return value.Coding.display ?? '';
    }

    if (value.string) {
        return value.string;
    }

    if (value.integer) {
        return value.integer;
    }

    console.warn(`There is not implementation for getDisplay of ${JSON.stringify(value)}`);

    return '';
}

export function getArrayDisplay(options?: QuestionnaireItemAnswerOption[]): string | null {
    if (!options) {
        return null;
    }

    return options.map((v: QuestionnaireItemAnswerOption) => getDisplay(v.value)).join(', ');
}
