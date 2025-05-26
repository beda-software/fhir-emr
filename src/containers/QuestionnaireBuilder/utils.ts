import _ from 'lodash';
import { FCEQuestionnaire, FCEQuestionnaireItem } from 'sdc-qrf';

export function getQuestionPath(
    questionnaire: FCEQuestionnaire,
    questionItem: FCEQuestionnaireItem,
    parentPath: (string | number)[],
) {
    const { linkId } = questionItem;

    if (parentPath.length === 0) {
        const index = questionnaire.item!.findIndex((i) => i.linkId === linkId);

        return ['item', index];
    } else {
        return parentPath.reduce(
            (acc: (string | number)[], pathItem: string | number) => {
                if (pathItem === 'items') {
                    const items: FCEQuestionnaireItem[] = _.get(questionnaire, [...acc, 'item'].join('.'));
                    const index = items.findIndex((i) => i.linkId === linkId);
                    return [...acc, 'item', index];
                } else {
                    const items: FCEQuestionnaireItem[] = _.get(questionnaire, acc.join('.'));
                    const index = items.findIndex((i) => i.linkId === pathItem);

                    return [...acc, index];
                }
            },
            ['item'],
        );
    }
}

interface MoveQuestionnaireItem {
    questionItem: FCEQuestionnaireItem;
    parentPath: string[];
}

export function moveQuestionnaireItem(
    questionnaire: FCEQuestionnaire,
    targetItem: MoveQuestionnaireItem,
    sourceItem: MoveQuestionnaireItem,
    place: 'before' | 'after' = 'after',
): FCEQuestionnaire {
    const sourcePath = getQuestionPath(questionnaire, sourceItem.questionItem, sourceItem.parentPath);
    const sourceItemsPath = sourcePath.slice(0, -1).join('.');
    const sourceItems: FCEQuestionnaireItem[] = _.get(questionnaire, sourceItemsPath);

    const filteredSourceItems = sourceItems.filter((i) => i.linkId !== sourceItem.questionItem.linkId);
    const newQuestionnaire = _.set(questionnaire, sourceItemsPath, filteredSourceItems);
    const newTargetPath = getQuestionPath(newQuestionnaire, targetItem.questionItem, targetItem.parentPath);
    const newTargetItemsPath = newTargetPath.slice(0, -1).join('.');
    const newTargetItems: FCEQuestionnaireItem[] = _.get(newQuestionnaire, newTargetItemsPath);

    const targetIndex = newTargetItems.findIndex((i) => i.linkId === targetItem.questionItem.linkId);
    let resultTargetItems = [];
    if (place === 'after') {
        resultTargetItems = [
            ...newTargetItems.slice(0, targetIndex + 1),
            sourceItem.questionItem,
            ...newTargetItems.slice(targetIndex + 1),
        ];
    } else {
        resultTargetItems = [
            ...newTargetItems.slice(0, targetIndex),
            sourceItem.questionItem,
            ...newTargetItems.slice(targetIndex),
        ];
    }

    const resultQuestionnaire = _.set(newQuestionnaire, newTargetItemsPath, resultTargetItems);

    return resultQuestionnaire;
}

export function deleteQuestionnaireItem(
    questionnaire: FCEQuestionnaire,
    item: MoveQuestionnaireItem,
): FCEQuestionnaire {
    const path = getQuestionPath(questionnaire, item.questionItem, item.parentPath);
    const itemsPath = path.slice(0, -1).join('.');
    const items: FCEQuestionnaireItem[] = _.get(questionnaire, itemsPath);

    const filteredItems = items.filter((i) => i.linkId !== item.questionItem.linkId);
    const newQuestionnaire = _.set(questionnaire, itemsPath, filteredItems);

    return newQuestionnaire;
}
