import { QuestionnaireItemEnableWhen as FHIRQuestionnaireItemEnableWhen } from 'fhir/r4b';
import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

export function processItems(fhirQuestionnaire: FHIRQuestionnaire) {
    return fhirQuestionnaire.item?.map(processItem);
}

function processItem(item: any) {
    let properties: any = {};

    const updatedProperties = getUpdatedPropertiesFromItem(item);
    properties = { ...properties, ...updatedProperties };

    const convertedItem = convertItemProperties(item);

    const newItem = {
        ...convertedItem,
        ...properties,
        extension: undefined,
    };

    if (newItem.extension === undefined) {
        delete newItem.extension;
    }

    if (newItem.itemControl === undefined) {
        delete newItem.itemControl;
    }

    return newItem;
}

function getUpdatedPropertiesFromItem(item: any) {
    const updatedProperties: any = {};

    updatedProperties.hidden = findExtension(
        item,
        'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
    )?.valueBoolean;
    updatedProperties.initialExpression = findExtension(
        item,
        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
    )?.valueExpression;
    updatedProperties.itemControl = findExtension(
        item,
        'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    )?.valueCodeableConcept;
    updatedProperties.itemPopulationContext = findExtension(
        item,
        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext',
    )?.valueExpression;

    updatedProperties.answerOption = item.answerOption
        ?.map((option: any) => {
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
                        Coding: {
                            code: option.valueCoding?.code,
                            display: option.valueCoding?.display,
                            system: option.valueCoding?.system,
                        },
                    },
                };
            }
            if (option.valueReference) {
                return {
                    value: {
                        Reference: {
                            resourceType: option.valueReference?.resourceType,
                            display: option.valueReference?.display,
                            extension: option.valueReference?.extension,
                            localRef: option.valueReference?.localRef,
                            resource: option.valueReference?.resource,
                            type: option.valueReference?.type,
                            uri: option.valueReference?.reference,
                        },
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
            return option;
        })
        .filter(Boolean);

    updatedProperties.adjustLastToRight = findExtension(
        item,
        'https://beda.software/fhir-emr-questionnaire/adjust-last-to-right',
    )?.valueBoolean;
    updatedProperties.initial = item.initial?.map((init: any) => {
        if (init.valueCoding !== undefined) {
            return { value: { Coding: init.valueCoding } };
        } else {
            return init;
        }
    });
    updatedProperties.start = findExtension(
        item,
        'https://beda.software/fhir-emr-questionnaire/slider-start',
    )?.valueInteger;
    updatedProperties.stop = findExtension(
        item,
        'https://beda.software/fhir-emr-questionnaire/slider-stop',
    )?.valueInteger;
    updatedProperties.helpText = findExtension(
        item,
        'https://beda.software/fhir-emr-questionnaire/help-text',
    )?.valueString;
    updatedProperties.stopLabel = findExtension(
        item,
        'https://beda.software/fhir-emr-questionnaire/slider-stop-label',
    )?.valueString;
    updatedProperties.sliderStepValue = findExtension(
        item,
        'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
    )?.valueInteger;
    updatedProperties.calculatedExpression = findExtension(
        item,
        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
    )?.valueExpression;
    updatedProperties.unit = findExtension(
        item,
        'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
    )?.valueCoding;
    updatedProperties.macro = findExtension(item, 'https://beda.software/fhir-emr-questionnaire/macro')?.valueString;
    updatedProperties.enableWhenExpression = findExtension(
        item,
        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
    )?.valueExpression;
    updatedProperties.answerExpression = findExtension(
        item,
        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression',
    )?.valueExpression;

    item.item?.forEach((nestedItem: any) => {
        const unit = findExtension(
            nestedItem,
            'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
        )?.valueCoding;

        if (unit !== undefined) {
            nestedItem.unit = unit;
        }
    });

    const boolean = item.initial?.find((init: any) => init.valueBoolean !== undefined)?.valueBoolean;
    if (boolean !== undefined) {
        updatedProperties.initial = [{ value: { boolean } }];
    }

    const choiceColumnExtension = findExtension(
        item,
        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn',
    )?.extension;
    if (choiceColumnExtension) {
        const forDisplay = choiceColumnExtension.find((obj: { url: string }) => obj.url === 'forDisplay').valueBoolean;
        const path = choiceColumnExtension.find((obj: { url: string }) => obj.url === 'path').valueString;
        const choiceColumnArray = [];
        choiceColumnArray.push({
            forDisplay: forDisplay ?? false,
            path,
        });
        updatedProperties.choiceColumn = choiceColumnArray;
    }

    const referenceResourceArray = [];
    const referenceResource = item.extension?.find(
        (ext: any) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
    )?.valueCode;
    if (referenceResource !== undefined) {
        referenceResourceArray.push(referenceResource);
    }
    if (referenceResourceArray.length > 0) {
        updatedProperties.referenceResource = referenceResourceArray;
    }

    if (item.initialExpression) {
        updatedProperties.initialExpression = {
            expression: item.initialExpression.expression,
            language: item.initialExpression.language,
        };
    }

    if (item.itemPopulationContext) {
        updatedProperties.itemPopulationContext = {
            expression: item.itemPopulationContext.expression,
            language: item.itemPopulationContext.language,
        };
    }

    updatedProperties.enableWhen = item.enableWhen?.map((item: FHIRQuestionnaireItemEnableWhen) => {
        return processEnableWhenItem(item);
    });

    return updatedProperties;
}

function convertItemProperties(item: any): any {
    const updatedProperties = getUpdatedPropertiesFromItem(item);
    const newItem = { ...item, ...updatedProperties };

    delete newItem.extension;

    if (newItem.item) {
        newItem.item = newItem.item.map((nestedItem: any) => convertItemProperties(nestedItem));
    }

    return newItem;
}

function findExtension(item: any, url: string) {
    return item.extension?.find((ext: any) => ext.url === url);
}

function processEnableWhenItem(item: FHIRQuestionnaireItemEnableWhen) {
    const { question, operator } = item;
    const answer = {};

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
            if (item.answerReference && item.answerReference.reference) {
                const { reference } = item.answerReference;
                const splitReference = reference.split('/') || [];
                const resourceType = splitReference[0];
                const id = splitReference[1];
                answer['Reference'] = { ...item.answerReference, id, resourceType };
                delete answer['Reference'].reference;
            } else {
                answer['Reference'] = { ...item.answerReference };
            }
            break;
        default:
            break;
    }

    return {
        question,
        operator,
        answer,
    };
}
