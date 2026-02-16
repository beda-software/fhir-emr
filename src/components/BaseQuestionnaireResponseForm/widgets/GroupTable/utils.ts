import { QuestionnaireItem } from 'fhir/r4b';
import _ from 'lodash';
import {
    AnswerValue,
    FCEQuestionnaireItem,
    FormAnswerItems,
    FormGroupItems,
    FormItems,
    getAnswerValues,
    getItemKey,
    isAnswerValueEmpty,
    toAnswerValue,
} from 'sdc-qrf';

import { parseFHIRReference } from '@beda.software/fhir-react';

import { formatHumanDate, formatHumanDateTime, formatHumanTime } from 'src/utils';

import { GroupTableRow } from './types';

export const isFormAnswerItems = (
    item: FormGroupItems | (FormAnswerItems | undefined)[] | undefined,
): item is FormAnswerItems[] => {
    return Array.isArray(item) && item.every((item) => item !== undefined && item !== null && 'value' in item);
};

export const getValueFromAnswerValue = (
    answerValue: AnswerValue,
    questionnaireItemType: QuestionnaireItem['type'],
    preFormat = false,
) => {
    switch (questionnaireItemType) {
        case 'string':
        case 'text':
            return answerValue.string;
        case 'boolean':
            if (!preFormat) {
                return answerValue.boolean;
            }
            if (answerValue.boolean === undefined) {
                return undefined;
            }
            return answerValue.boolean ? 'Yes' : 'No';
        case 'date':
            if (!preFormat) {
                return answerValue.date;
            }
            return formatHumanDate(answerValue.date);
        case 'dateTime':
            if (!preFormat) {
                return answerValue.dateTime;
            }
            return formatHumanDateTime(answerValue.dateTime);
        case 'time':
            if (!preFormat) {
                return answerValue.time;
            }
            return formatHumanTime(answerValue.time);
        case 'decimal':
            return answerValue.decimal;
        case 'integer':
            return answerValue.integer;
        case 'choice':
        case 'open-choice':
            return answerValue.Coding?.display ?? answerValue.Coding?.code;
        case 'attachment':
            return answerValue.Attachment?.title;
        case 'reference':
            if (!preFormat) {
                return answerValue.Reference?.display;
            }
            return (
                answerValue.Reference?.display ??
                (answerValue.Reference ? parseFHIRReference(answerValue.Reference).id : undefined)
            );
        case 'quantity':
            if (!preFormat) {
                return answerValue.Quantity?.value;
            }
            return answerValue.Quantity
                ? `${answerValue.Quantity.value ?? ''}${
                      answerValue.Quantity.unit ? ' ' + answerValue.Quantity.unit : ''
                  }`.trim()
                : undefined;
        default:
            return undefined;
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
    return getValueFromAnswerValue(firstValue, questionnaireItemType, false);
};

export const getDataSource = (
    fields: string[],
    formItems: FormItems[],
    questionItem: FCEQuestionnaireItem,
): GroupTableRow[] => {
    if (fields.length === 0) {
        return [];
    }

    if (!_.isArray(formItems)) {
        return [];
    }

    const dataSource = _.map(formItems, (item, index) => {
        const data: GroupTableRow = fields.reduce((acc: GroupTableRow, curr: string) => {
            const questionnaireItem = questionItem.item?.find((qItem) => qItem.linkId === curr);
            acc[curr] = {
                ...(curr in item ? { formItem: item[curr], questionnaireItem: questionnaireItem ?? undefined } : {}),
                index: index,
                linkId: curr,
            };

            return acc;
        }, {} as GroupTableRow);
        data.key = getItemKey(item);
        return data;
    });

    if (dataSource.length > 1) {
        return dataSource;
    } else if (dataSource.length === 1) {
        const innerItems = dataSource[0];
        if (!innerItems) {
            return [];
        }
        const isRowEmpty = Object.entries(innerItems).map(([, value]) => {
            if (_.isString(value)) {
                return true;
            }
            if (!value || !value.formItem || !value.formItem[0]) {
                return true;
            }
            const answer = toAnswerValue(value.formItem[0], 'value');
            if (!answer) {
                return true;
            }
            const isAnswerEmpty = isAnswerValueEmpty(answer);
            return isAnswerEmpty;
        });
        const rowIsEmpty = isRowEmpty.every((element) => element);

        return rowIsEmpty ? [] : dataSource;
    }

    return [];
};
