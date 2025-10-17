import _ from 'lodash';
import {
    cleanFormAnswerItems,
    FCEQuestionnaireItem,
    FormAnswerItems,
    FormItems,
    getEnabledQuestions,
    ItemContext,
} from 'sdc-qrf';

/**
 * Recursively extracts all questionnaire items (excluding display items and groups)
 * with their answer status from a questionnaire structure.
 *
 * @param groupItem - The questionnaire item to process
 * @param rootPath - Path to the parent item in the form structure
 * @param formValues - Complete form values
 * @param context - Item context for evaluation
 * @returns Array of tuples containing [questionItem, hasAnswers]
 */
export function getAllGroupQuestionsWithAnswerStatus(
    groupItem: FCEQuestionnaireItem,
    rootPath: string[],
    formValues: FormItems,
    context: ItemContext,
): [FCEQuestionnaireItem, boolean][] {
    const parentPath = [...rootPath, ...(rootPath.length ? ['items'] : []), groupItem.linkId, 'items'];
    const itemValues: FormItems = _.get(formValues, parentPath, {});

    return getAllGroupQuestionsWithAnswerStatusRecursive(groupItem, parentPath, itemValues, formValues, context);
}

function getAllGroupQuestionsWithAnswerStatusRecursive(
    groupItem: FCEQuestionnaireItem,
    parentPath: string[],
    groupValues: FormItems,
    formValues: FormItems,
    context: ItemContext,
): [FCEQuestionnaireItem, boolean][] {
    // TODO: the context is wrong here, it should be recalculated based on the current QR branch
    // TODO: see https://github.com/beda-software/sdc-qrf/blob/fe358a1a30efc994b25daec09b0837452923c574/src/components.tsx#L63
    // TODO: all variables including %qitem, %context - are not correct here for enableWhenExpression
    const enabledItems = getEnabledQuestions(groupItem.item!, parentPath, formValues, context);

    const allItemsWithAnswerStatus: [FCEQuestionnaireItem, boolean][] = [];

    enabledItems.forEach((item) => {
        if (item.type === 'group') {
            if (item.item) {
                // NOTE: The first repeatable group is taken for the statistics calculation only
                const subGroupRelativePath = [item.linkId, 'items', ...(item.repeats ? ['0'] : [])];
                const subGroupValues: FormItems = _.get(groupValues, subGroupRelativePath, {} as FormItems);
                const nestedItems = getAllGroupQuestionsWithAnswerStatusRecursive(
                    item,
                    [...parentPath, ...subGroupRelativePath],
                    subGroupValues,
                    formValues,
                    context,
                );
                allItemsWithAnswerStatus.push(...nestedItems);
            }
        } else if (item.type !== 'display') {
            const answers = cleanFormAnswerItems(
                _.get(groupValues, [item.linkId], []) as (FormAnswerItems | undefined)[],
            );
            allItemsWithAnswerStatus.push([item, answers.length > 0]);
        }
    });

    return allItemsWithAnswerStatus;
}
