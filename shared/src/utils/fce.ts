import {
    Coding,
    Extension,
    Questionnaire as FHIRQuestionnaire,
    QuestionnaireResponse as FHIRQuestionnaireResponse,
    Reference,
} from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
    CodeableConcept,
    Expression,
} from 'shared/src/contrib/aidbox';

interface ExtensionValue {
    'ex:createdAt': string;
    'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl': CodeableConcept;
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression': Expression;
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn': Extension[];
    'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource': Coding;
}

const extensionsMap: Record<keyof ExtensionValue, keyof Extension> = {
    'ex:createdAt': 'valueInstant',
    'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl': 'valueCodeableConcept',
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression': 'valueExpression',
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn': 'extension',
    'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource': 'valueCode',
};

export function extractExtension<U extends keyof ExtensionValue>(extension: Extension[] | undefined, url: U) {
    const e = extension?.find((e) => e.url === url);
    if (e) {
        const getter = extensionsMap[url];
        return e[getter] as ExtensionValue[U];
    }
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

function findExtension(item: any, url: string) {
    return item.extension?.find((ext: any) => ext.url === url);
}

function findInitialValue(item: any, property: string) {
    return item.initial?.find((init: any) => init[property] !== undefined)?.valueBoolean;
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

function processMeta(fhirQuestionnaire: FHIRQuestionnaire): any {
    const createdAt = getCreatedAt(fhirQuestionnaire);
    return {
        ...fhirQuestionnaire.meta,
        ...createdAt,
        extension: undefined,
    };
}

function processItems(fhirQuestionnaire: FHIRQuestionnaire): any[] | undefined {
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

function processAnswerToFHIR(items: any) {
    if (!items) {
        return;
    }

    function processAnswer(answerItem: any) {
        if (!answerItem.value) {
            return;
        }
        const value = answerItem.value;
        const valueMappings = {
            string: 'valueString',
            integer: 'valueInteger',
            boolean: 'valueBoolean',
            Coding: 'valueCoding',
            date: 'valueDate',
            dateTime: 'valueDateTime',
            time: 'valueTime',
        };
        for (const key in valueMappings) {
            if (key in value) {
                const newKey = valueMappings[key];
                if (newKey) {
                    answerItem[newKey] = value[key];
                }
                delete answerItem.value;
                break;
            }
        }
        if (value.Reference) {
            answerItem.valueReference = {
                display: value.Reference.display,
                reference: `${value.Reference.resourceType}/${value.Reference.id}`,
            };
            delete answerItem.value;
        }
    }

    for (const item of items) {
        if (item.answer) {
            for (const answer of item.answer) {
                processAnswer(answer);
            }
        }
        if (item.item) {
            processAnswerToFHIR(item.item);
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

function processMetaToFHIR(meta: any) {
    if (meta && meta.createdAt) {
        meta.extension = [
            {
                url: 'ex:createdAt',
                valueInstant: meta.createdAt,
            },
        ];
        delete meta.createdAt;
    }
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

function processReferenceToFHIR(fceQR: any) {
    if (fceQR.encounter && fceQR.encounter.resourceType && fceQR.encounter.id) {
        fceQR.encounter.reference = `${fceQR.encounter.resourceType}/${fceQR.encounter.id}`;
        delete fceQR.encounter.resourceType;
        delete fceQR.encounter.id;
    }
    if (fceQR.source && fceQR.source.resourceType && fceQR.source.id) {
        fceQR.source.reference = `${fceQR.source.resourceType}/${fceQR.source.id}`;
        delete fceQR.source.resourceType;
        delete fceQR.source.id;
    }
}

export function fromFHIRReference(r?: Reference) {
    if (!r || !r.reference) {
        return undefined;
    }

    const [resourceType, id] = r.reference?.split('/');

    return {
        id,
        resourceType,
    };
}

function processItemsToFHIR(items: any[] | undefined) {
    if (!items) {
        return;
    }
    items.forEach((item) => {
        if (item.item) {
            processItemsToFHIR(item.item);
        }

        if (item.macro) {
            const macroExtension = {
                url: 'https://beda.software/fhir-emr-questionnaire/macro',
                valueString: item.macro,
            };

            item.extension = item.extension || [];
            item.extension.push(macroExtension);
            delete item.macro;
        }

        if (item.itemControl) {
            const itemControlExtension = {
                url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                valueCodeableConcept: {
                    coding: item.itemControl.coding,
                },
            };
            item.extension = item.extension || [];
            item.extension.push(itemControlExtension);
            delete item.itemControl;
        }

        if (item.start !== undefined) {
            const startExtension = {
                url: 'https://beda.software/fhir-emr-questionnaire/slider-start',
                valueInteger: item.start,
            };
            item.extension = item.extension || [];
            item.extension.push(startExtension);
            delete item.start;
        }

        if (item.stop !== undefined) {
            const stopExtension = {
                url: 'https://beda.software/fhir-emr-questionnaire/slider-stop',
                valueInteger: item.stop,
            };
            item.extension = item.extension || [];
            item.extension.push(stopExtension);
            delete item.stop;
        }

        if (item.helpText !== undefined) {
            const helpTextExtension = {
                url: 'https://beda.software/fhir-emr-questionnaire/help-text',
                valueString: item.helpText,
            };
            item.extension = item.extension || [];
            item.extension.push(helpTextExtension);
            delete item.helpText;
        }

        if (item.stopLabel !== undefined) {
            const stopLabelExtension = {
                url: 'https://beda.software/fhir-emr-questionnaire/slider-stop-label',
                valueString: item.stopLabel,
            };
            item.extension = item.extension || [];
            item.extension.push(stopLabelExtension);
            delete item.stopLabel;
        }

        if (item.sliderStepValue !== undefined) {
            const sliderStepValueExtension = {
                url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
                valueInteger: item.sliderStepValue,
            };
            item.extension = item.extension || [];
            item.extension.push(sliderStepValueExtension);
            delete item.sliderStepValue;
        }

        if (item.adjustLastToRight !== undefined) {
            const adjustLastToRightExtension = {
                url: 'https://beda.software/fhir-emr-questionnaire/adjust-last-to-right',
                valueBoolean: item.adjustLastToRight,
            };
            item.extension = item.extension || [];
            item.extension.push(adjustLastToRightExtension);
            delete item.adjustLastToRight;
        }

        if (item.answerOption !== undefined) {
            item.answerOption.forEach((option: any) => {
                if (option.value && option.value.Coding) {
                    option.valueCoding = option.value.Coding;
                    delete option.value;
                }
                if (option.value && option.value.string) {
                    option.valueString = option.value.string;
                    delete option.value;
                }
                if (option.value && option.value.Reference) {
                    let reference = option.value.Reference;
                    option.valueReference = {};
                    if (reference.resourceType) option.valueReference.resourceType = reference.resourceType;
                    if (reference.display) option.valueReference.display = reference.display;
                    if (reference.extension) option.valueReference.extension = reference.extension;
                    if (reference.localRef) option.valueReference.localRef = reference.localRef;
                    if (reference.resource) option.valueReference.resource = reference.resource;
                    if (reference.type) option.valueReference.type = reference.type;
                    if (reference.uri) option.valueReference.reference = reference.uri;
                    delete option.value;
                }
                if (option.value && option.value.date) {
                    option.valueDate = option.value.date;
                    delete option.value;
                }
                if (option.value && option.value.integer) {
                    option.valueInteger = option.value.integer;
                    delete option.value;
                }
                if (option.value && option.value.time) {
                    option.valueTime = option.value.time;
                    delete option.value;
                }
            });
        }

        if (item.hidden !== undefined) {
            const hiddenExtension = {
                url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                valueBoolean: item.hidden,
            };
            item.extension = item.extension || [];
            item.extension.push(hiddenExtension);
            delete item.hidden;
        }

        if (item.enableWhen !== undefined) {
            const enableWhen = item.enableWhen.map((condition: { question: any; operator: any; answer: any }) => {
                const { question, operator, answer } = condition;
                const answerCoding = answer?.Coding;
                const answerBoolean = answer?.boolean;
                const result = {
                    question,
                    operator,
                    ...(answerCoding && { answerCoding }),
                };
                if (answerBoolean) {
                    result.answerBoolean = answerBoolean;
                }
                return result;
            });
            item.enableWhen = enableWhen;
        }

        if (item.initialExpression !== undefined) {
            const extension = {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                valueExpression: item.initialExpression,
            };
            item.extension = item.extension || [];
            item.extension.push(extension);
            delete item.initialExpression;
        }

        if (item.initial) {
            item.initial = item.initial.map((entry: any) => {
                const result: any = {};
                if (entry.value.boolean !== undefined) {
                    result.valueBoolean = entry.value.boolean;
                }
                if (entry.value.Coding !== undefined) {
                    result.valueCoding = entry.value.Coding;
                }
                return result;
            });
        }

        if (Array.isArray(item.choiceColumn)) {
            const extension: any = {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn',
                extension: [],
            };

            item.choiceColumn.forEach((column: { path: any; forDisplay: any }) => {
                if (typeof column.path === 'string') {
                    extension.extension.push({
                        url: 'path',
                        valueString: column.path,
                    });
                }

                if (typeof column.forDisplay === 'boolean') {
                    extension.extension.push({
                        url: 'forDisplay',
                        valueBoolean: column.forDisplay,
                    });
                }
            });

            if (extension.extension.length > 0) {
                item.extension = item.extension || [];
                item.extension.push(extension);
            }
            delete item.choiceColumn;
        }

        if (item.answerExpression) {
            const extension = {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression',
                valueExpression: item.answerExpression,
            };
            item.extension = item.extension || [];
            item.extension.push(extension);
            delete item.answerExpression;
        }

        if (item.referenceResource) {
            const referenceResourceExtension = {
                url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
                valueCode: item.referenceResource[0],
            };
            item.extension = item.extension || [];
            item.extension.push(referenceResourceExtension);
            delete item.referenceResource;
        }

        if (item.unit) {
            const unitExtension = {
                url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit', // unit url ?
                valueCoding: item.unit,
            };
            item.extension = item.extension || [];
            item.extension.push(unitExtension);
            delete item.unit;
        }

        if (item.calculatedExpression) {
            const calculatedExpressionExtension = {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
                valueExpression: {
                    language: item.calculatedExpression.language,
                    expression: item.calculatedExpression.expression,
                },
            };

            item.extension = item.extension || [];
            item.extension.push(calculatedExpressionExtension);
            delete item.calculatedExpression;
        }

        if (item.enableWhenExpression) {
            const enableWhenExpression = {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
                valueExpression: {
                    language: 'text/fhirpath',
                    expression: item.enableWhenExpression.expression,
                },
            };
            item.extension = item.extension || [];
            item.extension.push(enableWhenExpression);
            delete item.enableWhenExpression;
        }
    });
}

function processExtensionsToFHIR(questionnaire: FCEQuestionnaire) {
    if (questionnaire.launchContext) {
        const extension: any[] = [];
        for (const launchContext of questionnaire.launchContext as any) {
            const name = launchContext.name;
            const typeList = launchContext.type;
            const description = launchContext.description;

            if (typeList) {
                for (const typeCode of typeList) {
                    const launchContextExtension: any = [
                        {
                            url: 'name',
                            valueCoding: name,
                        },
                        { url: 'type', valueCode: typeCode },
                    ];

                    if (description !== undefined) {
                        launchContextExtension.push({
                            url: 'description',
                            valueString: description,
                        });
                    }

                    extension.push({
                        url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
                        extension: launchContextExtension,
                    });
                }
            }
        }

        questionnaire.extension = questionnaire.extension || [];
        questionnaire.extension.push(...extension);
        delete questionnaire.launchContext;
    }

    if (questionnaire.mapping) {
        const mappingExtension = questionnaire.mapping.map((mapping) => ({
            url: 'http://beda.software/fhir-extensions/questionnaire-mapper',
            valueReference: {
                reference: `Mapping/${mapping.id}`,
            },
        }));
        questionnaire.extension = questionnaire.extension || [];
        questionnaire.extension.push(...mappingExtension);
        delete questionnaire.mapping;
    }

    if (questionnaire.sourceQueries) {
        const sourceQueries = questionnaire.sourceQueries;
        for (const item of sourceQueries) {
            const extension = {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-sourceQueries',
                valueReference: { reference: `#${item.localRef}` },
            };
            questionnaire.extension = questionnaire.extension ?? [];
            questionnaire.extension.push(extension);
        }
        delete questionnaire.sourceQueries;
    }

    if (questionnaire.targetStructureMap) {
        const extensions = questionnaire.targetStructureMap.map((targetStructureMapRef) => ({
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-targetStructureMap',
            valueCanonical: targetStructureMapRef,
        }));

        questionnaire.extension = questionnaire.extension || [];
        questionnaire.extension.push(...extensions);
        delete questionnaire.targetStructureMap;
    }
}

export function toFirstClassExtension(fhirQuestionnaireResponse: FHIRQuestionnaireResponse): FCEQuestionnaireResponse;
export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire;
export function toFirstClassExtension(fhirResource: any): any {
    if (fhirResource.resourceType === 'Questionnaire') {
        const fhirQuestionnaire = JSON.parse(JSON.stringify(fhirResource));
        checkFhirQuestionnaireProfile(fhirQuestionnaire);
        const meta = processMeta(fhirQuestionnaire);
        const item = processItems(fhirQuestionnaire);
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

export function fromFirstClassExtension(fceQuestionnaireResponse: FCEQuestionnaireResponse): FHIRQuestionnaireResponse;
export function fromFirstClassExtension(fceQuestionnaire: FCEQuestionnaire): FHIRQuestionnaire;
export function fromFirstClassExtension(fceResource: any): any {
    if (fceResource.resourceType === 'Questionnaire') {
        const questionnaire = JSON.parse(JSON.stringify(fceResource));
        processMetaToFHIR(questionnaire.meta);
        processItemsToFHIR(questionnaire.item);
        processExtensionsToFHIR(questionnaire);
        return questionnaire as unknown as FHIRQuestionnaire;
    }
    if (fceResource.resourceType === 'QuestionnaireResponse') {
        const questionnaireResponse = JSON.parse(JSON.stringify(fceResource));
        processAnswerToFHIR(questionnaireResponse.item);
        processMetaToFHIR(questionnaireResponse.meta);
        processReferenceToFHIR(questionnaireResponse);
        return questionnaireResponse as unknown as FHIRQuestionnaireResponse;
    }
}
