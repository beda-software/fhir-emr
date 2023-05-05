import { Questionnaire as FHIRQuestionnaire, QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

export function toFirstClassExtension(fhirQuestionnaireResponse: FHIRQuestionnaireResponse): FCEQuestionnaireResponse;
export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire;
export function toFirstClassExtension(fhirResource: any): any {
    if (fhirResource.resourceType === 'Questionnaire') {
        const fhirQuestionnaire = JSON.parse(JSON.stringify(fhirResource));
        checkFhirQuestionnaireProfile(fhirQuestionnaire);
        const meta = processMeta(fhirQuestionnaire);
        const item = processItemsToFCE(fhirQuestionnaire);
        const extensions = processExtensions(fhirQuestionnaire);
        const questionnaire = trimUndefined({
            ...fhirQuestionnaire,
            meta,
            item,
            ...extensions,
            extension: undefined,
        });
        return questionnaire as unknown as FCEQuestionnaire;
    }
    if (fhirResource.resourceType === 'QuestionnaireResponse') {
        const questionnaireResponse = JSON.parse(JSON.stringify(fhirResource));
        processAnswerToFCE(questionnaireResponse.item);
        if (questionnaireResponse.meta) {
            processMetaToFCE(questionnaireResponse.meta);
        }
        processReferenceToFCE(questionnaireResponse);
        return questionnaireResponse as unknown as FCEQuestionnaireResponse;
    }
}

function checkFhirQuestionnaireProfile(fhirQuestionnaire: FHIRQuestionnaire): void {
    if (
        !(
            (fhirQuestionnaire.meta?.profile?.length ?? 0) === 1 &&
            fhirQuestionnaire.meta?.profile?.[0] === 'https://beda.software/beda-emr-questionnaire'
        )
    ) {
        throw new Error('Only beda emr questionanire supported');
    }
}

function processMeta(fhirQuestionnaire: FHIRQuestionnaire): any {
    const createdAt = getCreatedAt(fhirQuestionnaire);
    return {
        ...fhirQuestionnaire.meta,
        ...createdAt,
        extension: undefined,
    };
}

function processItemsToFCE(fhirQuestionnaire: FHIRQuestionnaire): any[] | undefined {
    return fhirQuestionnaire.item?.map(processItem);
}

function processExtensions(fhirQuestionnaire: FHIRQuestionnaire): {
    launchContext?: any[];
    mapping?: any[];
    sourceQueries?: any[];
    targetStructureMap?: any[];
} {
    const launchContext = processLaunchContext(fhirQuestionnaire);
    const mapping = processMapping(fhirQuestionnaire);
    const sourceQueries = processSourceQueries(fhirQuestionnaire);
    const targetStructureMap = processTargetStructureMap(fhirQuestionnaire);

    return {
        launchContext: launchContext?.length ? launchContext : undefined,
        mapping: mapping?.length ? mapping : undefined,
        sourceQueries: sourceQueries?.length ? sourceQueries : undefined,
        targetStructureMap: targetStructureMap?.length ? targetStructureMap : undefined,
    };
}

function trimUndefined(e: any) {
    for (const prop in e) {
        if (e.hasOwnProperty(prop)) {
            const val = e[prop];
            if (val === undefined) {
                delete e[prop];
            } else if (typeof val === 'object') {
                if (Array.isArray(val)) {
                    for (let i = 0; i < val.length; i++) {
                        if (typeof val[i] === 'object') {
                            trimUndefined(val[i]);
                        }
                    }
                } else {
                    trimUndefined(val);
                }
            }
        }
    }

    return e;
}

function processAnswerToFCE(items: any) {
    if (!items) {
        return;
    }

    function processAnswer(answer: any) {
        const valueHandlers: any = {
            valueString: (value: any) => ({ string: value }),
            valueInteger: (value: any) => ({ integer: value }),
            valueBoolean: (value: any) => ({ boolean: value }),
            valueCoding: (value: any) => ({ Coding: value }),
            valueDate: (value: any) => ({ date: value }),
            valueDateTime: (value: any) => ({ dateTime: value }),
            valueReference: (value: any) => ({
                Reference: {
                    display: value.display,
                    id: value.reference.split('/').slice(-1)[0],
                    resourceType: value.reference.split('/')[0],
                },
            }),
            valueTime: (value: any) => ({ time: value }),
        };

        for (const key in valueHandlers) {
            if (key in answer) {
                const value = answer[key];
                delete answer[key];
                answer.value = valueHandlers[key]?.(value);
            }
        }
    }

    for (const item of items) {
        if (item.answer) {
            for (const answer of item.answer) {
                processAnswer(answer);
            }
        }
        if (item.item) {
            processAnswerToFCE(item.item);
        }
    }
}

function processMetaToFCE(meta: any) {
    if (meta && meta.extension) {
        meta.extension.forEach((ext: any) => {
            if (ext.url === 'ex:createdAt') {
                meta.createdAt = ext.valueInstant;
                delete ext.url;
                delete ext.valueInstant;
            }
        });
    }
    delete meta.extension;
}

function processReferenceToFCE(fhirQuestionnaireResponse: any) {
    if (fhirQuestionnaireResponse.encounter && fhirQuestionnaireResponse.encounter.reference) {
        const [resourceType, id] = fhirQuestionnaireResponse.encounter.reference.split('/');
        fhirQuestionnaireResponse.encounter = {
            resourceType,
            id,
        };
    }
    if (fhirQuestionnaireResponse.source && fhirQuestionnaireResponse.source.reference) {
        const [resourceType, id] = fhirQuestionnaireResponse.source.reference.split('/');
        fhirQuestionnaireResponse.source = {
            resourceType,
            id,
        };
    }
}

function getCreatedAt(fhirQuestionnaire: FHIRQuestionnaire): { createdAt?: string } {
    const metaExtension = fhirQuestionnaire.meta?.extension?.find((ext) => ext.url === 'ex:createdAt');
    return metaExtension ? { createdAt: metaExtension.valueInstant } : {};
}

function processItem(item: any): any {
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

export function processLaunchContext(fhirQuestionnaire: FHIRQuestionnaire): any[] | undefined {
    let launchContextExtensions = fhirQuestionnaire.extension ?? [];

    launchContextExtensions = launchContextExtensions.filter(
        (ext) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
    );

    if (launchContextExtensions.length === 0) {
        return undefined;
    }

    const launchContextArray = [];
    for (const launchContextExtension of launchContextExtensions) {
        const nameExtension = launchContextExtension.extension?.find((ext) => ext.url === 'name');
        const typeExtensions = launchContextExtension.extension?.filter((ext) => ext.url === 'type');
        const descriptionExtension = launchContextExtension.extension?.find((ext) => ext.url === 'description');

        const nameCode = nameExtension?.valueCoding?.code;
        const typeCodes = typeExtensions?.map((typeExtension) => typeExtension.valueCode!);
        const description = descriptionExtension?.valueString;

        let contextFound = false;
        for (const context of launchContextArray) {
            if (context.name.code === nameCode) {
                context.type.push(...(typeCodes ?? []));
                contextFound = true;
                break;
            }
        }

        if (!contextFound) {
            const context: any = {
                name: nameExtension?.valueCoding,
                type: typeCodes ?? [],
            };
            if (description) {
                context.description = description;
            }
            launchContextArray.push(context);
        }
    }

    return launchContextArray;
}

function processMapping(fhirQuestionnaire: FHIRQuestionnaire): any[] | undefined {
    const mapperExtensions = fhirQuestionnaire.extension?.filter(
        (ext: any) => ext.url === 'http://beda.software/fhir-extensions/questionnaire-mapper',
    );

    if (!mapperExtensions) {
        return undefined;
    }

    return mapperExtensions.map((mapperExtension: any) => ({
        id: mapperExtension.valueReference?.reference?.split('/')[1],
        resourceType: 'Mapping',
    }));
}

function processSourceQueries(fhirQuestionnaire: FHIRQuestionnaire): any[] {
    const extensions =
        fhirQuestionnaire.extension?.filter(
            (ext) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-sourceQueries',
        ) ?? [];

    return extensions.map((ext) => ({
        localRef: ext.valueReference?.reference?.substring(1) ?? '',
    }));
}

function processTargetStructureMap(fhirQuestionnaire: FHIRQuestionnaire): string[] | undefined {
    const extensions = fhirQuestionnaire.extension?.filter(
        (ext) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-targetStructureMap',
    );

    if (!extensions) {
        return undefined;
    }

    return extensions.map((extension) => extension.valueCanonical!);
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
