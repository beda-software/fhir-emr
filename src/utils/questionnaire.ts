import { t } from '@lingui/macro';
import _ from 'lodash';
import * as yup from 'yup';

import {
    Questionnaire,
    QuestionnaireItemAnswerOption,
    QuestionnaireResponseItemAnswer,
    QuestionnaireResponseItemAnswerValue,
} from '@beda.software/aidbox-types';
import { parseFHIRTime } from '@beda.software/fhir-react';

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

    if (_.isNumber(value.integer)) {
        return value.integer.toString();
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
        if (item.type === 'string' || item.type === 'text') {
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
        } else if (item.type === 'reference') {
            schema = yup
                .object({
                    resourceType: yup.string().required(),
                    display: yup.string().nullable(),
                    id: yup.string().required(),
                })
                .required();

            if (item.required) {
                schema = createSchemaArray(yup.object({ Reference: schema })).required();
            } else {
                schema = yup.mixed().nullable();
            }
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

export function getAnswerCode(o: QuestionnaireItemAnswerOption['value'] | QuestionnaireResponseItemAnswer['value']) {
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
