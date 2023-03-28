import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

import { Questionnaire as AidboxQuestionnaire } from 'shared/src/contrib/aidbox';

export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): AidboxQuestionnaire {
    if (
        !(
            (fhirQuestionnaire.meta?.profile?.length ?? 0) == 1 &&
            fhirQuestionnaire.meta?.profile?.[0] == 'https://beda.software/beda-emr-questionnaire'
        )
    ) {
        throw new Error('Only beda emr questionanire supported');
    }

    const metaExtension = fhirQuestionnaire.meta.extension?.find(
        (ext: any) => ext.url === 'ex:createdAt',
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

    return nq as unknown as AidboxQuestionnaire;
}
