import type { ColumnType, ColumnsType, CompareFn } from 'antd/es/table/interface';
import { Coding, QuestionnaireItem } from 'fhir/r4b';
import _ from 'lodash';
import moment from 'moment';
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

import {
    ColumnFilterValue,
    SearchBarColumn,
    SearchBarColumnType,
    isChoiceColumn,
    isDateColumn,
    isDateColumnFilterValue,
    isReferenceColumn,
    isSingleDateColumn,
    isSingleDateColumnFilterValue,
    isSolidChoiceColumn,
    isSplitStringColumn,
    isSplitStringColumnFilterValue,
    isStringColumn,
    isStringColumnFilterValue,
} from 'src/components/SearchBar/types';
import { compileAsArray, formatHumanDate, formatHumanDateTime, formatHumanTime } from 'src/utils';

import { GroupTableItem, GroupTableRow } from './types';

const questionnaireItemChoiceOptions = compileAsArray<FCEQuestionnaireItem, Coding>(`item.answerOption.valueCoding`);

export const isFormAnswerItems = (
    item: FormGroupItems | (FormAnswerItems | undefined)[] | undefined,
): item is FormAnswerItems[] => {
    return Array.isArray(item) && item.every((item) => item !== undefined && item !== null && 'value' in item);
};

export const getValueFromAnswerValue = (
    answerValue: AnswerValue,
    questionnaireItemType: QuestionnaireItem['type'],
    preFormat: boolean | ((type: QuestionnaireItem['type']) => boolean) = false,
) => {
    const applyPreFormat = typeof preFormat === 'function' ? preFormat(questionnaireItemType) : preFormat;
    switch (questionnaireItemType) {
        case 'string':
        case 'text':
            return answerValue.string;
        case 'boolean':
            if (!applyPreFormat) {
                return answerValue.boolean;
            }
            if (answerValue.boolean === undefined) {
                return undefined;
            }
            return answerValue.boolean ? 'Yes' : 'No';
        case 'date':
            if (!applyPreFormat) {
                return answerValue.date;
            }
            return formatHumanDate(answerValue.date);
        case 'dateTime':
            if (!applyPreFormat) {
                return answerValue.dateTime;
            }
            return formatHumanDateTime(answerValue.dateTime);
        case 'time':
            if (!applyPreFormat) {
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
            if (!applyPreFormat) {
                return answerValue.Reference?.display;
            }
            return (
                answerValue.Reference?.display ??
                (answerValue.Reference ? parseFHIRReference(answerValue.Reference).id : undefined)
            );
        case 'quantity':
            if (!applyPreFormat) {
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
    preFormat: boolean | ((type: QuestionnaireItem['type']) => boolean) = false,
) => {
    const answerValues = getAnswerValues(FormAnswerItem);
    if (!answerValues[0]) {
        return null;
    }
    const firstValue = answerValues[0];

    return getValueFromAnswerValue(firstValue, questionnaireItemType, preFormat);
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

export const getSearchBarColumnType = (questionItem: FCEQuestionnaireItem): SearchBarColumn => {
    const type = questionItem.type;
    switch (type) {
        case 'date':
        case 'dateTime':
            return {
                id: questionItem.linkId,
                type: SearchBarColumnType.DATE,
                placeholder: ['From...', 'To...'],
            };
        case 'choice':
        case 'open-choice':
        case 'time':
        case 'reference':
        case 'boolean':
        case 'decimal':
        case 'integer':
        case 'attachment':
        case 'quantity':
        case 'string':
        case 'text':
        default:
            return {
                id: questionItem.linkId,
                placeholder: 'Search...',
                type: SearchBarColumnType.SPLITSTRING,
                searchBehavior: 'AND',
                separator: ' ',
            };
    }
};

export const getTableItemValue = (
    formItem: FormGroupItems | (FormAnswerItems | undefined)[] | undefined,
    questionItem: FCEQuestionnaireItem,
) => {
    if (!isFormAnswerItems(formItem)) {
        return undefined;
    }
    const answerValue = getAnswerValues(formItem);
    if (!answerValue[0]) {
        return undefined;
    }
    const value = getValueFromAnswerValue(answerValue[0], questionItem.type);
    return value;
};

export const isColumnTypeArray = (column: ColumnsType<GroupTableRow>): column is ColumnType<GroupTableRow>[] => {
    return 'dataIndex' in column;
};

export const isTableItemMatchesFilter = (item?: GroupTableItem, filterValue?: ColumnFilterValue) => {
    if (!item || !item.formItem || !item.questionnaireItem || !filterValue) {
        return true;
    }
    const itemValue = getTableItemValue(item.formItem, item.questionnaireItem);

    if (!itemValue) {
        return true;
    }

    if (isStringColumnFilterValue(filterValue) && _.isString(itemValue)) {
        const value = filterValue.value;
        return value && !_.isEmpty(value) ? itemValue.toLowerCase().includes(value.toLowerCase()) : true;
    }

    if (isSplitStringColumnFilterValue(filterValue) && _.isString(itemValue)) {
        if (filterValue.column.searchBehavior === 'AND') {
            const values = filterValue.value?.split(filterValue.column.separator ?? ' ') ?? [];
            return values?.every((value) => itemValue.toLowerCase().includes(value.toLowerCase()));
        } else if (filterValue.column.searchBehavior === 'OR') {
            const values = filterValue.value?.split(filterValue.column.separator ?? ' ') ?? [];
            return values?.some((value) => itemValue.toLowerCase().includes(value.toLowerCase()));
        }
    }

    if (isDateColumnFilterValue(filterValue) && _.isString(itemValue)) {
        const fromDate = filterValue.value?.[0];
        const toDate = filterValue.value?.[1];
        const testValue = moment(itemValue);
        return testValue.isBetween(fromDate, toDate, undefined, '[]');
    }

    if (isSingleDateColumnFilterValue(filterValue) && _.isString(itemValue)) {
        const testValue = moment(itemValue);
        return testValue.isSameOrAfter(filterValue.value) && testValue.isSameOrBefore(filterValue.value);
    }

    return true;
};

export const createColumnFilterValue = (column: SearchBarColumn): ColumnFilterValue => {
    if (isStringColumn(column)) {
        return { column };
    }
    if (isDateColumn(column)) {
        return { column };
    }
    if (isSingleDateColumn(column)) {
        return { column };
    }
    if (isReferenceColumn(column)) {
        return { column };
    }
    if (isChoiceColumn(column)) {
        return { column };
    }
    if (isSolidChoiceColumn(column)) {
        return { column };
    }
    if (isSplitStringColumn(column)) {
        return { column };
    }

    throw new Error('Unsupported column type');
};

const mapBooleanToNumber = (value: boolean | undefined) => {
    switch (value) {
        case true:
            return 1;
        case false:
            return 0;
        case undefined:
            return -1;
        default:
            throw new Error('Invalid boolean value');
    }
};

const mapChoiceToNumber = (value: GroupTableItem, options: Coding[]) => {
    const valueCode = value.formItem?.[0]?.value?.Coding?.code;
    return options.findIndex((option) => option.code === valueCode);
};

export const getGeneralSorter =
    (linkId: string, questionItem: FCEQuestionnaireItem): CompareFn<GroupTableRow> =>
    (a, b) => {
        const itemA = a[linkId];
        const itemB = b[linkId];
        if (itemA === undefined || itemB === undefined) {
            return 0;
        }

        const valueA = getTableItemValue(itemA.formItem, questionItem);
        const valueB = getTableItemValue(itemB.formItem, questionItem);

        if ((_.isString(valueA) || valueA === undefined) && (_.isString(valueB) || valueB === undefined)) {
            return (valueA ?? '').localeCompare(valueB ?? '');
        }

        if ((_.isNumber(valueA) || valueA === undefined) && (_.isNumber(valueB) || valueB === undefined)) {
            return (valueA ?? 0) - (valueB ?? 0);
        }

        if ((_.isBoolean(valueA) || valueA === undefined) && (_.isBoolean(valueB) || valueB === undefined)) {
            return mapBooleanToNumber(valueA) - mapBooleanToNumber(valueB);
        }

        return 0;
    };

export const getGroupTableItemSorter = (
    questionItem: FCEQuestionnaireItem,
    linkId: string,
): CompareFn<GroupTableRow> => {
    const type = questionItem.type;
    switch (type) {
        case 'choice':
        case 'open-choice':
            return (a, b) => {
                const itemA = a[linkId];
                const itemB = b[linkId];
                const options = questionnaireItemChoiceOptions(questionItem);
                if (options.length > 0) {
                    const valueAnumber = itemA ? mapChoiceToNumber(itemA, options) : -1;
                    const valueBnumber = itemB ? mapChoiceToNumber(itemB, options) : -1;
                    return valueAnumber - valueBnumber;
                }
                return getGeneralSorter(linkId, questionItem)(a, b);
            };
        default:
            return getGeneralSorter(linkId, questionItem);
    }
};

export const getSorter = (questionItem: FCEQuestionnaireItem, linkId: string): CompareFn<GroupTableRow> => {
    const sortedQuestionItem = questionItem.item?.find((item) => item.linkId === linkId);
    if (!sortedQuestionItem) {
        return () => 0;
    }
    return getGroupTableItemSorter(sortedQuestionItem, linkId);
};
