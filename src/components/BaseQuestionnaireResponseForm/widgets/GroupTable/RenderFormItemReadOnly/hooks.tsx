import { FormGroupItems, getAnswerValues, isAnswerValueEmpty } from 'sdc-qrf';

import { RenderFormItemReadOnlyProps, RenderRow } from './types';
import { getValueFromAnswerValue, isFormAnswerItems } from '../utils';

const getAnswerValuesRecursive = (
    questionnaireItem: RenderFormItemReadOnlyProps['questionnaireItem'],
    formItem: RenderFormItemReadOnlyProps['formItem'],
    depth: number,
): RenderRow[] => {
    if (!questionnaireItem || !formItem) {
        return [];
    }

    const questionnaireItemType = questionnaireItem.type;
    const itemControl = questionnaireItem.itemControl?.coding?.[0]?.code;
    const isMarkdownString = itemControl === 'markdown-editor';

    if (questionnaireItemType === 'group') {
        const groupFormItem = formItem as FormGroupItems | undefined;
        const groupQuestionnaireItems = questionnaireItem.item ?? [];

        return groupQuestionnaireItems.flatMap((item) => {
            const childFormItem = groupFormItem?.items?.[item.linkId];
            return getAnswerValuesRecursive(item, childFormItem, depth + 1);
        });
    }

    if (!isFormAnswerItems(formItem)) {
        return [];
    }

    const answerValues = getAnswerValues(formItem);
    if (answerValues.length === 0) {
        return [];
    }

    const formattedValues = answerValues
        .filter((answerValue) => !isAnswerValueEmpty(answerValue))
        .map((answerValue) => getValueFromAnswerValue(answerValue, questionnaireItemType, true))
        .filter((value): value is string => value !== null && value !== undefined && value !== '');

    if (formattedValues.length === 0) {
        return [];
    }

    const label = questionnaireItem.text ?? '';
    const value = `${formattedValues.join(', ')}`;

    return [
        {
            depth,
            label,
            value,
            isMarkdown: isMarkdownString,
        },
    ];
};

export function useRenderFormItemReadOnly(props: RenderFormItemReadOnlyProps) {
    const { formItem, questionnaireItem } = props;

    const emptySymbol = '-';

    if (!formItem || !questionnaireItem) {
        return { rows: [], emptySymbol };
    }

    const rows = getAnswerValuesRecursive(questionnaireItem, formItem, 0);

    return { rows, emptySymbol };
}
