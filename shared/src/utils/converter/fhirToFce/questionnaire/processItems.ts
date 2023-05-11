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

    const hidden = findExtension(item, 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden')?.valueBoolean;
    const initialExpression = findExtension(
        item,
        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
    )?.valueExpression;
    const itemPopulationContext = findExtension(
        item,
        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext',
    )?.valueExpression;
    const itemControl = findExtension(
        item,
        'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    )?.valueCodeableConcept;

    updatedProperties.hidden = hidden;
    updatedProperties.initialExpression = initialExpression;
    updatedProperties.itemControl = itemControl;
    updatedProperties.itemPopulationContext = itemPopulationContext;

    if (item.type === 'string' || item.type === 'date' || item.type === 'dateTime') {
        processStringDateTime(item, updatedProperties);
    }

    if (item.type === 'choice') {
        processChoiceType(item, updatedProperties);
    }

    if (item.type === 'decimal') {
        processDecimalType(item, updatedProperties);
    }

    if (item.type === 'integer') {
        processInteger(item, updatedProperties);
    }

    if (item.type === 'text') {
        processTextType(item, updatedProperties);
    }

    if (item.type === 'group') {
        processGroupType(item, updatedProperties);
    }

    if (item.type === 'boolean') {
        processBooleanType(item, updatedProperties);
    }

    if (item.type === 'reference') {
        processReferenceType(item, updatedProperties);
    }

    if (item.initialExpression) {
        processInitialExpression(item, updatedProperties);
    }

    if (item.itemPopulationContext) {
        processItemPopulationContex(item, updatedProperties);
    }
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

function findInitialValue(item: any, property: string) {
    return item.initial?.find((init: any) => init[property] !== undefined)?.valueBoolean;
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

function processReferenceType(item: any, updatedProperties: any) {
    const choiceColumnExtension = item.extension?.find(
        (ext: any) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn',
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

    updatedProperties.answerExpression = item.extension?.find(
        (ext: any) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression',
    )?.valueExpression;

    const referenceResourceArray = [];
    const referenceResource = item.extension?.find(
        (ext: any) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
    )?.valueCode;
    referenceResourceArray.push(referenceResource);

    const enableWhen = item.enableWhen?.map((item: FHIRQuestionnaireItemEnableWhen) => {
        return processEnableWhenItem(item);
    });

    if (Array.isArray(enableWhen) && enableWhen.length > 0) {
        updatedProperties.enableWhen = enableWhen;
    }

    updatedProperties.referenceResource = referenceResourceArray;
}

function processChoiceType(item: any, updatedProperties: any) {
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

    updatedProperties.adjustLastToRight = item.extension?.find(
        (ext: { url: string }) => ext.url === 'https://beda.software/fhir-emr-questionnaire/adjust-last-to-right',
    )?.valueBoolean;

    const enableWhen = item.enableWhen?.map((item: FHIRQuestionnaireItemEnableWhen) => {
        return processEnableWhenItem(item);
    });

    if (Array.isArray(enableWhen) && enableWhen.length > 0) {
        updatedProperties.enableWhen = enableWhen;
    }

    updatedProperties.initial = item.initial?.map((init: any) => {
        if (init.valueCoding !== undefined) {
            return { value: { Coding: init.valueCoding } };
        } else {
            return init;
        }
    });
}

function processDecimalType(item: any, updatedProperties: any) {
    updatedProperties.start = item.extension?.find(
        (ext: any) => ext.url === 'https://beda.software/fhir-emr-questionnaire/slider-start',
    )?.valueInteger;
    updatedProperties.stop = item.extension?.find(
        (ext: any) => ext.url === 'https://beda.software/fhir-emr-questionnaire/slider-stop',
    )?.valueInteger;
    updatedProperties.helpText = item.extension?.find(
        (ext: any) => ext.url === 'https://beda.software/fhir-emr-questionnaire/help-text',
    )?.valueString;
    updatedProperties.stopLabel = item.extension?.find(
        (ext: any) => ext.url === 'https://beda.software/fhir-emr-questionnaire/slider-stop-label',
    )?.valueString;
    updatedProperties.sliderStepValue = item.extension?.find(
        (ext: any) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
    )?.valueInteger;
}

function processTextType(item: any, updatedProperties: any) {
    updatedProperties.macro = item.extension?.find(
        (ext: { url: string }) => ext.url === 'https://beda.software/fhir-emr-questionnaire/macro',
    )?.valueString;

    updatedProperties.enableWhenExpression = item.extension?.find(
        (ext: { url: string }) =>
            ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
    )?.valueExpression;

    const enableWhen = item.enableWhen?.map((item: FHIRQuestionnaireItemEnableWhen) => {
        return processEnableWhenItem(item);
    });

    if (Array.isArray(enableWhen) && enableWhen.length > 0) {
        updatedProperties.enableWhen = enableWhen;
    }
}

function processGroupType(item: any, updatedProperties: any) {
    item.item?.forEach((nestedItem: any) => {
        const unit = nestedItem.extension?.find(
            (ext: any) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
        )?.valueCoding;

        if (unit !== undefined) {
            nestedItem.unit = unit;
        }
    });

    const enableWhen = item.enableWhen?.map((item: FHIRQuestionnaireItemEnableWhen) => {
        return processEnableWhenItem(item);
    });

    if (Array.isArray(enableWhen) && enableWhen.length > 0) {
        updatedProperties.enableWhen = enableWhen;
    }
}

function processInteger(item: any, updatedProperties: any) {
    updatedProperties.calculatedExpression = item.extension?.find(
        (ext: { url: string }) =>
            ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
    )?.valueExpression;

    updatedProperties.unit = item.extension?.find(
        (ext: { url: string }) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
    )?.valueCoding;
}

function processStringDateTime(item: any, updatedProperties: any) {
    updatedProperties.initial = item.initial?.map((init: any) => {
        if (init.valueCoding !== undefined) {
            return { value: { Coding: init.valueCoding } };
        } else {
            return init;
        }
    });
}

function processBooleanType(item: any, updatedProperties: any) {
    const boolean = findInitialValue(item, 'valueBoolean');
    if (boolean !== undefined) {
        updatedProperties.initial = [{ value: { boolean } }];
    }
}

function processInitialExpression(item: any, updatedProperties: any) {
    updatedProperties.initialExpression = {
        expression: item.initialExpression.expression,
        language: item.initialExpression.language,
    };
}

function processItemPopulationContex(item: any, updatedProperties: any) {
    updatedProperties.itemPopulationContext = {
        expression: item.itemPopulationContext.expression,
        language: item.itemPopulationContext.language,
    };
}
