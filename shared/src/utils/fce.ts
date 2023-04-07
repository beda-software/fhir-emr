import {
    Coding,
    // Element,
    Extension,
    Questionnaire as FHIRQuestionnaire,
    QuestionnaireResponse as FHIRQuestionnaireResponse,
    // QuestionnaireItem as FHIRQuestionnaireItem,
    // QuestionnaireItemAnswerOption as FHIRQuestionnaireItemAnswerOption,
    // Resource,
    Reference,
} from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
    // QuestionnaireItem as FCEQuestionnaireItem,
    // QuestionnaireItemAnswerOption as FCEQuestionnaireItemAnswerOption,
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
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression':
        'valueExpression',
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn': 'extension',
    'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource': 'valueCode',
};

export function extractExtension<U extends keyof ExtensionValue>(
    extension: Extension[] | undefined,
    url: U,
) {
    const e = extension?.find((e) => e.url === url);
    if (e) {
        const getter = extensionsMap[url];
        return e[getter] as ExtensionValue[U];
    }
}

// function extractChoiceColumn(extensions: any[]): any | undefined {
//     const choiceColumnExtension = extensions.find(
//         (ext: any) =>
//             ext.url ===
//             'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn',
//     );

//     if (choiceColumnExtension) {
//         return choiceColumnExtension.extension;
//     }

//     return undefined;
// }

// function removeExtensions<E extends Element>(e: E): Omit<E, 'extension'> {
//     delete e.extension;
//     return e;
// }

// function convertAnswerOption(
//     answerOption?: FHIRQuestionnaireItemAnswerOption[],
// ): FCEQuestionnaireItemAnswerOption[] | undefined {
//     if (answerOption) {
//         return answerOption.map((ao) => {
//             const rao: Required<FCEQuestionnaireItemAnswerOption> = {
//                 id: ao.id!,
//                 initialSelected: ao.initialSelected!,
//                 extension: [],
//                 modifierExtension: [],
//                 value: {
//                     Coding: removeExtensions(ao.valueCoding!),
//                 },
//             };
//             return rao;
//         });
//     } else {
//         return undefined;
//     }
// }

// function convertItem(fhirQuestinnaireItem: FHIRQuestionnaireItem): FCEQuestionnaireItem {
//     const resultItem: Required<FCEQuestionnaireItem> = {
//         linkId: fhirQuestinnaireItem.linkId,
//         type: fhirQuestinnaireItem.type,
//         answerExpression: extractExtension(
//             fhirQuestinnaireItem.extension,
//             'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression',
//         )!,
//         answerOption: convertAnswerOption(fhirQuestinnaireItem.answerOption)!,
//         answerValueSet: fhirQuestinnaireItem.answerValueSet!,
//         item: fhirQuestinnaireItem.item?.map((i) => convertItem(i))!,
//     };
//     return resultItem;
// }

// function trimUndefined<E extends Element>(e: E): E {
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

    const hidden = findExtension(
        item,
        'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
    )?.valueBoolean;
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
                if (option.valueCoding === undefined) {
                    if (option.valueString) {
                        return {
                            value: {
                                string: option.valueString,
                            },
                        };
                    }
                }
                const value = {
                    Coding: {
                        code: option.valueCoding?.code,
                        display: option.valueCoding?.display,
                    },
                };

                (value.Coding as any).system = option.valueCoding.system;

                return {
                    value,
                };
            })
            .filter(Boolean);

        updatedProperties.adjustLastToRight = item.extension?.find(
            (ext: { url: string }) =>
                ext.url === 'https://beda.software/fhir-emr-questionnaire/adjust-last-to-right',
        )?.valueBoolean;

        const enableWhen = item.enableWhen?.map(
            (condition: { question: any; operator: any; answerCoding: any }) => {
                return {
                    question: condition.question,
                    operator: condition.operator,
                    answer: {
                        Coding: condition.answerCoding,
                    },
                };
            },
        );
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
            (ext: any) =>
                ext.url === 'https://beda.software/fhir-emr-questionnaire/slider-stop-label',
        )?.valueString;
        updatedProperties.sliderStepValue = item.extension?.find(
            (ext: any) =>
                ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
        )?.valueInteger;
    }

    if (item.type === 'integer') {
        updatedProperties.calculatedExpression = item.extension?.find(
            (ext: { url: string }) =>
                ext.url ===
                'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
        )?.valueExpression;

        updatedProperties.unit = item.extension?.find(
            (ext: { url: string }) =>
                ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
        )?.valueCoding;
    }

    if (item.type === 'text') {
        updatedProperties.macro = item.extension?.find(
            (ext: { url: string }) =>
                ext.url === 'https://beda.software/fhir-emr-questionnaire/macro',
        )?.valueString;

        updatedProperties.enableWhenExpression = item.extension?.find(
            (ext: { url: string }) =>
                ext.url ===
                'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
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
                (ext: any) =>
                    ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
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
            (ext: any) =>
                ext.url ===
                'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn',
        ).extension;

        const forDisplay = choiceColumnExtension.find(
            (obj: { url: string }) => obj.url === 'forDisplay',
        ).valueBoolean;

        const path = choiceColumnExtension.find(
            (obj: { url: string }) => obj.url === 'path',
        ).valueString;

        const choiceColumnArray = [];
        choiceColumnArray.push({
            forDisplay: forDisplay ?? false,
            path,
        });
        updatedProperties.choiceColumn = choiceColumnArray;

        updatedProperties.answerExpression = item.extension?.find(
            (ext: any) =>
                ext.url ===
                'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression',
        ).valueExpression;

        const referenceResourceArray = [];
        const referenceResource = item.extension?.find(
            (ext: any) =>
                ext.url ===
                'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
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
    const metaExtension = fhirQuestionnaire.meta?.extension?.find(
        (ext) => ext.url === 'ex:createdAt',
    );
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
    const launchContextExtensions = fhirQuestionnaire.extension?.filter(
        (ext: any) =>
            ext.url ===
            'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
    );

    if (!launchContextExtensions) {
        return undefined;
    }

    return launchContextExtensions.map((launchContextExtension: any) => {
        const nameExtension = launchContextExtension.extension?.find(
            (ext: any) => ext.url === 'name',
        );
        const typeExtension = launchContextExtension.extension?.find(
            (ext: any) => ext.url === 'type',
        );
        const descriptionExtension = launchContextExtension.extension?.find(
            (ext: any) => ext.url === 'description',
        );
        const nameCode = nameExtension?.valueId?.code;
        const typeCode = typeExtension?.valueCode;
        const description = descriptionExtension?.valueString;

        const context = {
            name: {
                code: nameCode,
            },
            type: typeCode,
        };

        if (description) {
            (context as any).description = description;
        }

        return context;
    });
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
} {
    const launchContext = processLaunchContext(fhirQuestionnaire);
    const mapping = processMapping(fhirQuestionnaire);

    return {
        launchContext: launchContext?.length ? launchContext : undefined,
        mapping: mapping?.length ? mapping : undefined,
    };
}

// QuestionnaireResponse

function processAnswerToFCE(itemList: any[] | undefined) {
    if (!itemList) {
        return;
    }
    itemList.forEach((item) => {
        if (item.answer && item.answer[0]?.valueString) {
            item.answer[0].value = {
                string: item.answer[0]?.valueString,
            };
            delete item.answer[0]?.valueString;
        } else if (item.answer && item.answer[0]?.valueInteger) {
            item.answer[0].value = {
                integer: item.answer[0]?.valueInteger,
            };
            delete item.answer[0]?.valueInteger;
        } else if (item.answer && item.answer[0]?.valueBoolean) {
            item.answer[0].value = {
                boolean: item.answer[0]?.valueBoolean,
            };
            delete item.answer[0]?.valueBoolean;
        } else if (item.answer && item.answer[0]?.valueCoding) {
            item.answer[0].value = {
                Coding: item.answer[0]?.valueCoding,
            };
            delete item.answer[0]?.valueCoding;
        } else if (item.answer && item.answer[0]?.valueDate) {
            item.answer[0].value = {
                date: item.answer[0]?.valueDate,
            };
            delete item.answer[0]?.valueDate;
        } else if (item.answer && item.answer[0]?.valueDateTime) {
            item.answer[0].value = {
                dateTime: item.answer[0]?.valueDateTime,
            };
            delete item.answer[0]?.valueDateTime;
        } else if (item.answer && item.answer[0]?.valueReference) {
            const { display, resource } = item.answer[0]?.valueReference;
            const { resourceType } = resource;
            item.answer[0].value = {
                Reference: {
                    display,
                    id: resource.id,
                    resource,
                    resourceType,
                },
            };
            delete item.answer[0]?.valueReference;
        } else if (item.answer && item.answer[0]?.valueTime) {
            item.answer[0].value = {
                time: item.answer[0]?.valueTime,
            };
            delete item.answer[0]?.valueTime;
        } else if (item.item) {
            processAnswerToFCE(item.item);
        }
    });
}

function processAnswerToFHIR(itemList: any[] | undefined) {
    if (!itemList) {
        return;
    }
    itemList.forEach((item) => {
        if (item.answer && item.answer[0]?.value?.string) {
            item.answer[0].valueString = item.answer[0]?.value.string;
            delete item.answer[0]?.value;
        } else if (item.answer && item.answer[0]?.value?.integer) {
            item.answer[0].valueInteger = item.answer[0]?.value.integer;
            delete item.answer[0]?.value;
        } else if (item.answer && item.answer[0]?.value?.boolean) {
            item.answer[0].valueBoolean = item.answer[0]?.value.boolean;
            delete item.answer[0]?.value;
        } else if (item.answer && item.answer[0]?.value?.Coding) {
            item.answer[0].valueCoding = item.answer[0]?.value.Coding;
            delete item.answer[0]?.value;
        } else if (item.answer && item.answer[0]?.value?.date) {
            item.answer[0].valueDate = item.answer[0]?.value.date;
            delete item.answer[0]?.value;
        } else if (item.answer && item.answer[0]?.value?.dateTime) {
            item.answer[0].valueDateTime = item.answer[0]?.value.dateTime;
            delete item.answer[0]?.value;
        } else if (item.answer && item.answer[0]?.value?.Reference) {
            const { display, resource, resourceType, id } = item.answer[0]?.value.Reference;
            item.answer[0].valueReference = {
                display,
                resource,
                reference: `${resourceType}/${id}`,
            };
            delete item.answer[0]?.value;
        } else if (item.answer && item.answer[0]?.value?.time) {
            item.answer[0].valueTime = item.answer[0]?.value.time;
            delete item.answer[0]?.value;
        } else if (item.item) {
            processAnswerToFHIR(item.item);
        }
    });
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

export function toFirstClassExtension(
    fhirQuestionnaire: FHIRQuestionnaireResponse,
): FCEQuestionnaireResponse;
export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire;
export function toFirstClassExtension(fhirResource: any): any {
    if (fhirResource.resourceType === 'Questionnaire') {
        const fhirQuestionnaire = fhirResource;
        checkFhirQuestionnaireProfile(fhirQuestionnaire);
        const meta = processMeta(fhirQuestionnaire);
        const item = processItems(fhirQuestionnaire);
        const { launchContext, mapping } = processExtensions(fhirQuestionnaire);
        const nq: any = {
            ...fhirQuestionnaire,
            meta,
            item,
            launchContext,
            mapping,
            extension: undefined,
        };
        const resultNQ = trimUndefined(nq);
        return resultNQ as unknown as FCEQuestionnaire;
    }
    if (fhirResource.resourceType === 'QuestionnaireResponse') {
        const fhirQuestionnaireResponse = JSON.parse(JSON.stringify(fhirResource));
        processAnswerToFCE(fhirQuestionnaireResponse.item as any[]);
        if (fhirQuestionnaireResponse.meta) {
            processMetaToFCE(fhirQuestionnaireResponse.meta);
        }
        processReferenceToFCE(fhirQuestionnaireResponse);
        return fhirQuestionnaireResponse as unknown as FCEQuestionnaireResponse;
    }
}

export function fromFirstClassExtension(
    fhirQuestionnaire: FCEQuestionnaireResponse,
): FHIRQuestionnaireResponse;
export function fromFirstClassExtension(fhirQuestionnaire: FCEQuestionnaire): FHIRQuestionnaire;
export function fromFirstClassExtension(fceResource: any): any {
    if (fceResource.resourceType === 'Questionnaire') {
        /* WORK IN PROGRESS */
        /* You can try it with most questionnaires, but the questions may change places */
        const questionnaire = fceResource;
        processMetaToFHIR(questionnaire.meta);
        processItemsToFHIR(questionnaire.item);
        processExtensionsToFHIR(questionnaire);
        const result = questionnaire;
        return result as unknown as FHIRQuestionnaire;
    }
    if (fceResource.resourceType === 'QuestionnaireResponse') {
        const fceQuestionnaireResponse = JSON.parse(JSON.stringify(fceResource));
        processAnswerToFHIR(fceQuestionnaireResponse.item as any[]);
        processMetaToFHIR(fceQuestionnaireResponse.meta);
        processReferenceToFHIR(fceQuestionnaireResponse);
        return fceQuestionnaireResponse as unknown as FHIRQuestionnaireResponse;
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

        if (item.sliderStepValue !== undefined) {
            const sliderStepValueExtension = {
                url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
                valueInteger: item.sliderStepValue,
            };
            item.extension = item.extension || [];
            item.extension.push(sliderStepValueExtension);
            delete item.sliderStepValue;
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

        if (item.stopLabel !== undefined) {
            const stopLabelExtension = {
                url: 'https://beda.software/fhir-emr-questionnaire/slider-stop-label',
                valueString: item.stopLabel,
            };
            item.extension = item.extension || [];
            item.extension.push(stopLabelExtension);
            delete item.stopLabel;
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
            const enableWhen = item.enableWhen.map(
                (condition: { question: any; operator: any; answer: any }) => {
                    const { question, operator, answer } = condition;
                    const answerCoding = answer?.Coding;
                    return {
                        question,
                        operator,
                        ...(answerCoding && { answerCoding }),
                    };
                },
            );
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
            item.initial = item.initial.map((entry: { value: { Coding: any } }) => {
                return {
                    valueCoding: entry.value.Coding,
                };
            });
            item.extension = item.extension || [];
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

        if (item.referenceResource) {
            const referenceResourceExtension = {
                url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
                valueCode: item.referenceResource[0],
            };
            item.extension = item.extension || [];
            item.extension.push(referenceResourceExtension);
            delete item.referenceResource;
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

        if (item.macro) {
            const macroExtension = {
                url: 'https://beda.software/fhir-emr-questionnaire/macro',
                valueString: item.macro,
            };

            item.extension = item.extension || [];
            item.extension.push(macroExtension);
            delete item.macro;
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

        if (item.unit) {
            const unitExtension = {
                url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
                valueCoding: item.unit,
            };
            item.extension = item.extension || [];
            item.extension.push(unitExtension);
            delete item.unit;
        }
    });
}

function processExtensionsToFHIR(questionnaire: FCEQuestionnaire) {
    if (questionnaire.launchContext) {
        const extension: any = questionnaire.launchContext.map((launchContext: any) => {
            const name = launchContext.name.code;
            const type = launchContext.type;
            const description = launchContext.description;

            const extension: any = [
                {
                    url: 'name',
                    valueId: {
                        code: name,
                    },
                },
                {
                    url: 'type',
                    valueCode: type,
                },
            ];

            if (description !== undefined) {
                extension.push({
                    url: 'description',
                    valueString: description,
                });
            }

            return {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
                extension,
            };
        });

        questionnaire.extension = questionnaire.extension || [];
        questionnaire.extension.push(...extension);
        delete questionnaire.launchContext;
    }

    if (questionnaire.mapping) {
        const mappingExtension = {
            url: 'http://beda.software/fhir-extensions/questionnaire-mapper',
            valueReference: {
                reference: `Mapping/${questionnaire.mapping[0]?.id}`,
            },
        };
        questionnaire.extension = questionnaire.extension || [];
        questionnaire.extension.push(mappingExtension);
        delete questionnaire.mapping;
    }
}
