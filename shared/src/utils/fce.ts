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

export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaireResponse): FCEQuestionnaireResponse;
export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire;
export function toFirstClassExtension(fhirQuestionnaire: any): any {
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

export function fromFirstClassExtension(fhirQuestionnaire: FCEQuestionnaireResponse): FHIRQuestionnaireResponse;
export function fromFirstClassExtension(fhirQuestionnaire: FCEQuestionnaire): FHIRQuestionnaire;
export function fromFirstClassExtension(fhirQuestionnaire: any): any {
    return fhirQuestionnaire;
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
