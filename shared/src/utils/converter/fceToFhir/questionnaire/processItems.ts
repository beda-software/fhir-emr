export function processItems(items: any[] | undefined) {
    if (!items) {
        return;
    }
    items.forEach((item) => {
        if (item.item) {
            processItems(item.item);
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
