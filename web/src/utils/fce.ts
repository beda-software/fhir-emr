import { Element, Extension,
         Questionnaire as FHIRQuestionnaire,
         QuestionnaireItem as FHIRQuestionnaireItem,
         QuestionnaireItemAnswerOption as FHIRQuestionnaireItemAnswerOption,
         Resource,
       } from 'fhir/r4b';

import { Questionnaire as FCEQuestionnaire,
         QuestionnaireItem as FCEQuestionnaireItem,
         QuestionnaireItemAnswerOption as FCEQuestionnaireItemAnswerOption,
         CodeableConcept, Expression } from 'shared/src/contrib/aidbox';

interface ExtensionValue {
    'ex:createdAt': string,
    'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl': CodeableConcept,
    "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression": Expression,
}

const extensionsMap:Record<keyof ExtensionValue, keyof Extension> = {
    'ex:createdAt': 'valueInstant',
    'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl': 'valueCodeableConcept',
    "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression": 'valueExpression',
};


function extractExtension<U extends keyof ExtensionValue>(extension: Extension[] | undefined, url:U){
    const e = extension?.find(e => e.url == url);
    if(e){
        const getter = extensionsMap[url];
        return e[getter] as ExtensionValue[U];
    }
}

function removeExtensions<E extends Element>(e:E): Omit<E, 'extension'>{
    delete e.extension;
    return e;
}

function trimUndefined<E extends Element>(e: E): E{
    //recursevly delete all properties that has undefined value
    return e;
}

function convertAnswerOption(answerOption?: FHIRQuestionnaireItemAnswerOption[]): FCEQuestionnaireItemAnswerOption[] | undefined{
    if(answerOption){
        return answerOption.map(ao => {
            const rao: Required<FCEQuestionnaireItemAnswerOption> = {
                id: ao.id!,
                initialSelected: ao.initialSelected!,
                extension: [],
                modifierExtension: [],
                value: {
                    Coding: removeExtensions(ao.valueCoding!),
                }

            };
            return rao;
        })
    } else {
        return undefined;
    }
}

function convertItem(fhirQuestinnaireItem: FHIRQuestionnaireItem): FCEQuestionnaireItem{
    const resultItem: Required<FCEQuestionnaireItem> = {
        linkId: fhirQuestinnaireItem.linkId,
        type: fhirQuestinnaireItem.type,
        answerExpression: extractExtension(fhirQuestinnaireItem.extension,
                                           "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression"
                                          )!,
        answerOption: convertAnswerOption(fhirQuestinnaireItem.answerOption)!,
        answerValueSet: fhirQuestinnaireItem.answerValueSet!,
        item: fhirQuestinnaireItem.item?.map(i => convertItem(i))!,
    };
    return resultItem;
}

export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire {
    if (
        !(
            (fhirQuestionnaire.meta?.profile?.length ?? 0) == 1 &&
            fhirQuestionnaire.meta?.profile?.[0] == 'https://beda.software/beda-emr-questionnaire'
        )
    ) {
        throw new Error('Only beda emr questionanire supported');
    }

    const metaExtension = fhirQuestionnaire.meta.extension?.find(
        (ext) => ext.url === 'ex:createdAt',

    );
    const createdAt = metaExtension ? { createdAt: metaExtension.valueInstant } : {};

    const nq: any = {
        ...fhirQuestionnaire,
        meta: {
            ...fhirQuestionnaire.meta,
            ...createdAt,
            extension: undefined,
        },
        item: fhirQuestionnaire.item?.map((item: any) => {
            const itemControlExtension = item.extension?.find(
                (ext: any) =>
                    ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
            );
            const itemControl = itemControlExtension
                ? { itemControl: itemControlExtension.valueCodeableConcept }
                : {};

            const properties: any = {};

            if (item.type === 'decimal') {
                properties.start = item.extension?.find(
                    (ext: any) =>
                        ext.url === 'https://beda.software/fhir-emr-questionnaire/slider-start',
                )?.valueInteger;
                properties.stop = item.extension?.find(
                    (ext: any) =>
                        ext.url === 'https://beda.software/fhir-emr-questionnaire/slider-stop',
                )?.valueInteger;
                properties.helpText = item.extension?.find(
                    (ext: any) =>
                        ext.url === 'https://beda.software/fhir-emr-questionnaire/help-text',
                )?.valueString;
                properties.stopLabel = item.extension?.find(
                    (ext: any) =>
                        ext.url ===
                        'https://beda.software/fhir-emr-questionnaire/slider-stop-label',
                )?.valueString;
                properties.sliderStepValue = item.extension?.find(
                    (ext: any) =>
                        ext.url ===
                        'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
                )?.valueInteger;
            }

            if (item.type === 'choice') {
                properties.answerOption = item.answerOption.map((option: any) => {
                    if (option.valueCoding === undefined) {
                        if (option.valueString) {
                            return {
                                value: {
                                    string: option.valueString,
                                },
                            };
                        }
                    }
                    return {
                        value: {
                            Coding: option.valueCoding,
                        },
                    };
                });

                const initialExpression = item.extension?.find(
                    (ext: any) =>
                        ext.url ===
                        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                )?.valueExpression;

                if (initialExpression !== undefined) {
                    properties.initialExpression = initialExpression;
                }

                const adjustLastToRight = item.extension?.find(
                    (ext: any) =>
                        ext.url ===
                        'https://beda.software/fhir-emr-questionnaire/adjust-last-to-right',
                )?.valueBoolean;

                if (adjustLastToRight !== undefined) {
                    properties.adjustLastToRight = adjustLastToRight;
                }

                const enableWhen = item.enableWhen?.map((condition: any) => {
                    return {
                        question: condition.question,
                        operator: condition.operator,
                        answer: {
                            Coding: condition.answerCoding,
                        },
                    };
                });

                if (enableWhen !== undefined) {
                    properties.enableWhen = enableWhen;
                }
            }

            if (item.type === 'string') {
                const hidden = item.extension?.find(
                    (ext: any) =>
                        ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                )?.valueBoolean;

                if (hidden !== undefined) {
                    properties.hidden = hidden;
                }

                const initialExpression = item.extension?.find(
                    (ext: any) =>
                        ext.url ===
                        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                )?.valueExpression;

                if (initialExpression !== undefined) {
                    properties.initialExpression = initialExpression;
                }

                const initial = item.initial?.map((init: any) => {
                    if (init.valueCoding !== undefined) {
                        return { value: { Coding: init.valueCoding } };
                    } else {
                        return init;
                    }
                });

                if (initial !== undefined) {
                    properties.initial = initial;
                }
            }

            if (item.type === 'date' || item.type === 'dateTime') {
                const hidden = item.extension?.find(
                    (ext: any) =>
                        ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                )?.valueBoolean;

                if (hidden !== undefined) {
                    properties.hidden = hidden;
                }

                const initialExpression = item.extension?.find(
                    (ext: any) =>
                        ext.url ===
                        'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                )?.valueExpression;

                if (initialExpression !== undefined) {
                    properties.initialExpression = initialExpression;
                }
            }

            if (item.initialExpression) {
                properties.initialExpression = {
                    expression: item.initialExpression.expression,
                    language: item.initialExpression.language,
                };
            }

            const newItem = {
                ...item,
                ...itemControl,
                ...properties,
                extension: undefined,
            };

            if (newItem.extension === undefined) {
                delete newItem.extension;
            }

            return newItem;
        }),
    };

    if (nq.extension) {
        const launchContextExtensions = fhirQuestionnaire.extension?.filter(
            (ext: any) =>
                ext.url ===
                'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
        );

        const mapperExtensions = fhirQuestionnaire.extension?.filter(
            (ext: any) => ext.url === 'http://beda.software/fhir-extensions/questionnaire-mapper',
        );

        nq.launchContext = launchContextExtensions?.map((launchContextExtension: any) => ({
            name: {
                code: (
                    launchContextExtension.extension?.find((ext: any) => ext.url === 'name')
                        ?.valueId as any
                )?.code,
            },
            type: launchContextExtension.extension?.find((ext: any) => ext.url === 'type')
                ?.valueCode,
        }));

        nq.mapping = mapperExtensions?.map((mapperExtension: any) => ({
            id: mapperExtension.valueReference?.reference?.split('/')[1],
            resourceType: 'Mapping',
        }));

        if (nq.launchContext?.length === 0) {
            delete nq.launchContext;
        }

        if (nq.mapping?.length === 0) {
            delete nq.mapping;
        }
    }

    delete nq.meta.extension;

    delete nq.extension;

    return nq as unknown as FCEQuestionnaire;
}
