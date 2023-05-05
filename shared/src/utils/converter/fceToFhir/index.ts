import { Questionnaire as FHIRQuestionnaire, QuestionnaireResponse as FHIRQuestionnaireResponse } from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

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
