import { t } from '@lingui/macro';
import _ from 'lodash';
import * as yup from 'yup';

import {
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    QuestionnaireItemChoiceColumn,
    QuestionnaireResponseItemAnswer,
    QuestionnaireResponseItemAnswerValue,
} from '@beda.software/aidbox-types';
import { parseFHIRTime } from '@beda.software/fhir-react';

import { formatHumanDate, formatHumanDateTime } from './date';
import { getQuestionItemEnableWhenSchema } from './enableWhen';
import { evaluate } from './fhirpath';

export function getDisplay(
    value?: QuestionnaireResponseItemAnswerValue,
    choiceColumn?: QuestionnaireItemChoiceColumn[],
): string | number | null {
    if (!value) {
        return null;
    }

    if (value.Coding) {
        if (choiceColumn && choiceColumn.length) {
            const expression = choiceColumn[0]!.path;
            if (expression) {
                const calculatedValue = evaluate(value.Coding, expression)[0];
                return calculatedValue ?? '';
            }
        }
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

export function getArrayDisplay(
    options?: QuestionnaireResponseItemAnswer[],
    choiceColumn?: QuestionnaireItemChoiceColumn[],
): string | null {
    if (!options) {
        return null;
    }

    return options.map((v: QuestionnaireResponseItemAnswer) => getDisplay(v.value, choiceColumn)).join(', ');
}

export function questionnaireItemsToValidationSchema(questionnaireItems: QuestionnaireItem[]) {
    const validationSchema: Record<string, yup.AnySchema> = {};
    if (questionnaireItems.length === 0) return yup.object(validationSchema) as yup.AnyObjectSchema;
    questionnaireItems.forEach((item) => {
        let schema: yup.AnySchema;
        if (item.type === 'string' || item.type === 'text') {
            schema = yup.string();
            if (item.itemControl?.coding?.[0]?.code === 'email') schema = (schema as yup.StringSchema).email();
            if (item.required) schema = schema.required();
            if (item.maxLength && item.maxLength > 0) schema = (schema as yup.StringSchema).max(item.maxLength);
            schema = createSchemaArrayOfValues(yup.object({ string: schema }));
        } else if (item.type === 'integer') {
            schema = yup.number().integer();
            if (item.required) schema = schema.required();
            schema = createSchemaArrayOfValues(yup.object({ integer: schema }));
        } else if (item.type === 'date') {
            schema = yup.date();
            if (item.required) schema = schema.required();
            schema = createSchemaArrayOfValues(yup.object({ date: schema }));
        } else if (item.item) {
            schema = yup
                .object({
                    items: item.repeats
                        ? yup.array().of(questionnaireItemsToValidationSchema(item.item))
                        : questionnaireItemsToValidationSchema(item.item),
                })
                .required();
        } else {
            schema = item.required ? yup.array().of(yup.mixed()).min(1).required() : yup.mixed().nullable();
        }

        schema = item.required ? schema.required() : schema;

        if (item.enableWhen) {
            validationSchema[item.linkId] = getQuestionItemEnableWhenSchema({
                enableWhenItems: item.enableWhen,
                enableBehavior: item.enableBehavior,
                schema,
            });
        } else {
            validationSchema[item.linkId] = schema;
        }
    });

    return yup.object(validationSchema).required() as yup.AnyObjectSchema;
}

export function questionnaireToValidationSchema(questionnaire: Questionnaire) {
    return questionnaireItemsToValidationSchema(questionnaire.item ?? []);
}

function createSchemaArrayOfValues(value: yup.AnyObjectSchema) {
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
