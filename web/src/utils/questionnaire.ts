import * as yup from 'yup';

import {
    Questionnaire,
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

export function questionnaireToValidationSchema(questionnaire: Questionnaire) {
    const s: Record<string, yup.AnySchema> = {};

    if (questionnaire.item === undefined) return yup.object(s) as yup.AnyObjectSchema;

    questionnaire.item.forEach((item) => {
        if (item.type === 'string') {
            s[item.linkId] = yup
                .array()
                .of(
                    yup.object({
                        value: yup.object({
                            string: item.required ? yup.string().required() : yup.string(),
                        }),
                    }),
                )
                .required() as unknown as yup.AnySchema;
        } else if (item.type === 'integer') {
            s[item.linkId] = yup
                .array()
                .of(
                    yup.object({
                        value: yup.object({
                            integer: item.required
                                ? yup.number().min(1).max(9007199254740991).required()
                                : yup.number().min(1).max(9007199254740991),
                        }),
                    }),
                )
                .required() as unknown as yup.AnySchema;
        } else {
            (s[item.linkId] as any) = item.required
                ? yup.mixed().required()
                : yup.mixed().nullable();
        }
    });

    return yup.object(s).required() as yup.AnyObjectSchema;
}
