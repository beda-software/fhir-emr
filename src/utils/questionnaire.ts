import { t } from '@lingui/macro';
import * as yup from 'yup';

import {
    Questionnaire,
    QuestionnaireItemAnswerOption,
    QuestionnaireResponseItemAnswer,
    QuestionnaireResponseItemAnswerValue,
} from 'shared/src/contrib/aidbox';
import { parseFHIRTime } from 'shared/src/utils/date';

import { formatHumanDate, formatHumanDateTime } from './date';

export function getDisplay(value?: QuestionnaireResponseItemAnswerValue): string | number | null {
    if (!value) {
        return null;
    }

    if (value.Coding) {
        return value.Coding.display ?? '';
    }

    if (value.string) {
        return value.string;
    }

    if (value.date) {
        return formatHumanDate(value.date);
    }

    if (value.dateTime) {
        return formatHumanDateTime(value.dateTime);
    }

    if (value.time) {
        return parseFHIRTime(value.time).format('HH:mm');
    }

    if (value.integer) {
        return value.integer;
    }

    if (value.decimal) {
        return value.decimal;
    }

    if (value.boolean) {
        return value.boolean ? t`Yes` : t`No`;
    }

    if (value.Reference && value.Reference.display) {
        return value.Reference.display;
    }

    console.warn(`There is not implementation for getDisplay of ${JSON.stringify(value)}`);

    return '';
}

export function getArrayDisplay(options?: QuestionnaireResponseItemAnswer[]): string | null {
    if (!options) {
        return null;
    }

    return options.map((v: QuestionnaireResponseItemAnswer) => getDisplay(v.value)).join(', ');
}

export function questionnaireToValidationSchema(questionnaire: Questionnaire) {
    const validationSchema: Record<string, yup.AnySchema> = {};
    if (questionnaire.item === undefined) return yup.object(validationSchema) as yup.AnyObjectSchema;
    questionnaire.item.forEach((item) => {
        let schema: yup.AnySchema;
        if (item.type === 'string') {
            schema = yup.string();
            if (item.required) schema = schema.required();
            if (item.maxLength && item.maxLength > 0) schema = (schema as yup.StringSchema).max(item.maxLength);
            schema = createSchemaArray(yup.object({ string: schema })).required();
        } else if (item.type === 'integer') {
            schema = yup.number();
            if (item.required) schema = schema.required();
            schema = createSchemaArray(yup.object({ integer: schema })).required();
        } else if (item.type === 'date') {
            schema = yup.date();
            if (item.required) schema = schema.required();
            schema = createSchemaArray(yup.object({ date: schema })).required();
        } else {
            schema = item.required ? yup.mixed().required() : yup.mixed().nullable();
        }
        if (item.enableWhen) {
            item.enableWhen.forEach((itemEnableWhen) => {
                const { question, operator, answer } = itemEnableWhen;
                if (operator === '=') {
                    validationSchema[item.linkId] = yup.mixed().when(question, {
                        is: (answerOptionArray: QuestionnaireItemAnswerOption[]) =>
                            answerOptionArray &&
                            answerOptionArray.some(
                                (answerOption) => answerOption.value?.Coding?.code === answer?.Coding?.code,
                            ),
                        then: () => schema,
                        otherwise: () => yup.mixed().nullable(),
                    });
                }
            });
        } else {
            validationSchema[item.linkId] = schema;
        }
    });
    return yup.object(validationSchema).required() as yup.AnyObjectSchema;
}

function createSchemaArray(value: yup.AnyObjectSchema) {
    return yup.array().of(yup.object({ value }));
}
