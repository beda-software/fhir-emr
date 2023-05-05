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
    const itemControl = findExtension(
        item,
        'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    )?.valueCodeableConcept;

    updatedProperties.hidden = hidden;
    updatedProperties.initialExpression = initialExpression;
    updatedProperties.itemControl = itemControl;

    if (item.type === 'string' || item.type === 'date' || item.type === 'dateTime') {
        updatedProperties.initial = item.initial?.map((init: any) => {
            if (init.valueCoding !== undefined) {
                return { value: { Coding: init.valueCoding } };
            } else {
                return init;
            }
        });
    }

    if (item.type === 'choice') {
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

        const enableWhen = item.enableWhen?.map((condition: { question: any; operator: any; answerCoding: any }) => {
            return {
                question: condition.question,
                operator: condition.operator,
                answer: {
                    Coding: condition.answerCoding,
                },
            };
        });
        if (enableWhen?.length > 0) {
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

    if (item.type === 'decimal') {
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

    if (item.type === 'integer') {
        updatedProperties.calculatedExpression = item.extension?.find(
            (ext: { url: string }) =>
                ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
        )?.valueExpression;

        updatedProperties.unit = item.extension?.find(
            (ext: { url: string }) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
        )?.valueCoding;
    }

    if (item.type === 'text') {
        updatedProperties.macro = item.extension?.find(
            (ext: { url: string }) => ext.url === 'https://beda.software/fhir-emr-questionnaire/macro',
        )?.valueString;

        updatedProperties.enableWhenExpression = item.extension?.find(
            (ext: { url: string }) =>
                ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
        )?.valueExpression;

        const enableWhen = item.enableWhen?.map(
            (condition: { question: any; operator: any; answerBoolean: boolean }) => {
                return {
                    question: condition.question,
                    operator: condition.operator,
                    answer: {
                        boolean: condition.answerBoolean,
                    },
                };
            },
        );
        if (enableWhen?.length > 0) {
            updatedProperties.enableWhen = enableWhen;
        }
    }

    if (item.type === 'group') {
        item.item?.forEach((nestedItem: any) => {
            const unit = nestedItem.extension?.find(
                (ext: any) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
            )?.valueCoding;

            if (unit !== undefined) {
                nestedItem.unit = unit;
            }
        });

        const enableWhen = item.enableWhen?.map(
            (condition: { question: any; operator: any; answerBoolean: boolean }) => {
                return {
                    question: condition.question,
                    operator: condition.operator,
                    answer: {
                        boolean: condition.answerBoolean,
                    },
                };
            },
        );
        if (enableWhen?.length > 0) {
            updatedProperties.enableWhen = enableWhen;
        }
    }

    if (item.type === 'boolean') {
        const boolean = findInitialValue(item, 'valueBoolean');
        if (boolean !== undefined) {
            updatedProperties.initial = [{ value: { boolean } }];
        }
    }

    if (item.type === 'reference') {
        const choiceColumnExtension = item.extension?.find(
            (ext: any) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn',
        )?.extension;

        if (choiceColumnExtension) {
            const forDisplay = choiceColumnExtension.find(
                (obj: { url: string }) => obj.url === 'forDisplay',
            ).valueBoolean;

            const path = choiceColumnExtension.find((obj: { url: string }) => obj.url === 'path').valueString;

            const choiceColumnArray = [];
            choiceColumnArray.push({
                forDisplay: forDisplay ?? false,
                path,
            });
            updatedProperties.choiceColumn = choiceColumnArray;
        }

        updatedProperties.answerExpression = item.extension?.find(
            (ext: any) =>
                ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression',
        ).valueExpression;

        const referenceResourceArray = [];
        const referenceResource = item.extension?.find(
            (ext: any) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
        ).valueCode;
        referenceResourceArray.push(referenceResource);
        updatedProperties.referenceResource = referenceResourceArray;
    }

    if (item.initialExpression) {
        updatedProperties.initialExpression = {
            expression: item.initialExpression.expression,
            language: item.initialExpression.language,
        };
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
