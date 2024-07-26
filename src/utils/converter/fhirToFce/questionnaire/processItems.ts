import {
    QuestionnaireItemEnableWhen as FHIRQuestionnaireItemEnableWhen,
    Questionnaire as FHIRQuestionnaire,
    QuestionnaireItem as FHIRQuestionnaireItem,
    QuestionnaireItemAnswerOption as FHIRQuestionnaireItemAnswerOption,
    QuestionnaireItemInitial as FHIRQuestionnaireItemInitial,
} from 'fhir/r4b';

import {
    QuestionnaireItem as FCEQuestionnaireItem,
    QuestionnaireItemEnableWhen as FCEQuestionnaireItemEnableWhen,
    QuestionnaireItemEnableWhenAnswer as FCEQuestionnaireItemEnableWhenAnswer,
    QuestionnaireItemAnswerOption as FCEQuestionnaireItemAnswerOption,
    QuestionnaireItemInitial as FCEQuestionnaireItemInitial,
} from '@beda.software/aidbox-types';

import { convertFromFHIRExtension, findExtension, fromFHIRReference } from 'src/utils/converter';
import { ExtensionIdentifier } from 'src/utils/converter/extensions';

export function processItems(fhirQuestionnaire: FHIRQuestionnaire) {
    return fhirQuestionnaire.item?.map(convertItemProperties);
}

function convertItemProperties(item: FHIRQuestionnaireItem): FCEQuestionnaireItem {
    const updatedProperties = getUpdatedPropertiesFromItem(item);
    const newItem = { ...item, ...updatedProperties };

    newItem.item = item.item?.map((nestedItem) => convertItemProperties(nestedItem));

    if (newItem.extension) {
        delete newItem.extension;
    }

    return newItem;
}

function getUpdatedPropertiesFromItem(item: FHIRQuestionnaireItem) {
    let updatedProperties: FCEQuestionnaireItem = { linkId: item.linkId, type: item.type };

    for (const identifer in ExtensionIdentifier) {
        const identifierURI = ExtensionIdentifier[identifer];
        const extension = findExtension(item, identifierURI);
        if (extension !== undefined) {
            updatedProperties = {
                ...updatedProperties,
                ...convertFromFHIRExtension(extension),
            };
        }
    }

    updatedProperties.answerOption = item.answerOption?.map(processItemOption);
    updatedProperties.initial = item.initial?.map(processItemOption);
    updatedProperties.enableWhen = item.enableWhen?.map(processEnableWhenItem);

    return updatedProperties;
}

function processEnableWhenItem(item: FHIRQuestionnaireItemEnableWhen): FCEQuestionnaireItemEnableWhen {
    return {
        question: item.question,
        operator: item.operator,
        answer: processEnableWhenAnswerOption(item),
    };
}

function processEnableWhenAnswerOption(item: FHIRQuestionnaireItemEnableWhen) {
    const answer: FCEQuestionnaireItemEnableWhenAnswer = {};

    switch (true) {
        case 'answerBoolean' in item:
            answer['boolean'] = item.answerBoolean;
            break;
        case 'answerDecimal' in item:
            answer['decimal'] = item.answerDecimal;
            break;
        case 'answerInteger' in item:
            answer['integer'] = item.answerInteger;
            break;
        case 'answerDate' in item:
            answer['date'] = item.answerDate;
            break;
        case 'answerDateTime' in item:
            answer['dateTime'] = item.answerDateTime;
            break;
        case 'answerTime' in item:
            answer['time'] = item.answerTime;
            break;
        case 'answerString' in item:
            answer['string'] = item.answerString;
            break;
        case 'answerCoding' in item:
            answer['Coding'] = item.answerCoding;
            break;
        case 'answerQuantity' in item:
            answer['Quantity'] = item.answerQuantity;
            break;
        case 'answerReference' in item:
            if (item.answerReference) {
                answer['Reference'] = fromFHIRReference(item.answerReference);
            } else {
                throw Error("Can not process 'answerReference' with no reference inside");
            }
            break;
        default:
            break;
    }

    return answer;
}

function processItemOption(
    option: FHIRQuestionnaireItemAnswerOption | FHIRQuestionnaireItemInitial,
): FCEQuestionnaireItemAnswerOption | FCEQuestionnaireItemInitial {
    if (option.valueString) {
        return {
            value: {
                string: option.valueString,
            },
        };
    }
    if (option.valueCoding) {
        return {
            value: {
                Coding: option.valueCoding,
            },
        };
    }
    if (option.valueReference) {
        return {
            value: {
                Reference: fromFHIRReference(option.valueReference),
            },
        };
    }
    if (option.valueDate) {
        return {
            value: {
                date: option.valueDate,
            },
        };
    }
    if (option.valueInteger) {
        return {
            value: {
                integer: option.valueInteger,
            },
        };
    }
    if ('valueBoolean' in option) {
        return {
            value: {
                boolean: option.valueBoolean,
            },
        };
    }
    return option;
}
