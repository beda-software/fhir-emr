import { t } from '@lingui/macro';
import _ from 'lodash';
import { AnswerValue, FCEQuestionnaireItemChoiceColumn, FormAnswerItems } from 'sdc-qrf';

import { parseFHIRTime } from '@beda.software/fhir-react';

import { formatHumanDate, formatHumanDateTime } from './date';
import { evaluate } from './fhirpath';

export function getDisplay(
    value?: AnswerValue,
    choiceColumn?: FCEQuestionnaireItemChoiceColumn[],
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
    options?: FormAnswerItems[],
    choiceColumn?: FCEQuestionnaireItemChoiceColumn[],
): string | null {
    if (!options) {
        return null;
    }

    return options.map((v) => getDisplay(v.value, choiceColumn)).join(', ');
}

export type {
    CustomYupTestsMap,
    questionnaireItemsToValidationSchema,
} from '@beda.software/fhir-questionnaire/components';

export function getAnswerDisplay(value: AnswerValue) {
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

export function getAnswerCode(o: AnswerValue) {
    if (o?.Coding) {
        return o.Coding.code!;
    }
    if (o?.string) {
        return o.string;
    }

    if (o?.Reference) {
        return o.Reference.reference!;
    }

    return JSON.stringify(o);
}
