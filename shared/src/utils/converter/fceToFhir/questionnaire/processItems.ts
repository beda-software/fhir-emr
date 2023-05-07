import { Quantity as QuantityFHIR, QuestionnaireItemEnableWhen as FHIRQuestionnaireItemEnableWhen } from 'fhir/r4b';

import { QuestionnaireItemEnableWhen as FCEQuestionnaireItemEnableWhen } from '../../../../contrib/aidbox';
import { QuestionnaireItemEnableWhenAnswer as FCEQuestionnaireItemEnableWhenAnswer } from '../../../../contrib/aidbox';

export function processItems(items: any) {
    if (!items) {
        return;
    }
    items.forEach((item: any) => {
        if (item.macro) {
            processMacro(item);
        }

        if (item.itemControl) {
            processItemControl(item);
        }

        if (item.start !== undefined) {
            processStart(item);
        }

        if (item.stop !== undefined) {
            processStop(item);
        }

        if (item.helpText !== undefined) {
            processHelpText(item);
        }

        if (item.stopLabel !== undefined) {
            processStopLabel(item);
        }

        if (item.sliderStepValue !== undefined) {
            processSliderStepValue(item);
        }

        if (item.adjustLastToRight !== undefined) {
            processAdjustLastToRight(item);
        }

        if (item.answerOption !== undefined) {
            processAnswerOption(item);
        }

        if (item.hidden !== undefined) {
            processHidden(item);
        }

        if (item.enableWhen !== undefined) {
            processEnableWhen(item);
        }

        if (item.initial) {
            processInitial(item);
        }

        if (Array.isArray(item.choiceColumn)) {
            processChoiceColumn(item);
        }

        if (item.answerExpression) {
            processAnswerExpression(item);
        }

        if (item.initialExpression !== undefined) {
            processInitialExpression(item);
        }

        if (item.referenceResource) {
            processReferenceResource(item);
        }

        if (item.itemPopulationContext !== undefined) {
            processItemPopulationContext(item);
        }

        if (item.unit) {
            processUnit(item);
        }

        if (item.calculatedExpression) {
            processCalculatedExpression(item);
        }

        if (item.enableWhenExpression) {
            processEnableWhenExpression(item);
        }

        if (item.item) {
            processItems(item.item);
        }
    });
}

const convertEnableWhen = (
    answer: FCEQuestionnaireItemEnableWhenAnswer,
    answerType: string,
    result: FHIRQuestionnaireItemEnableWhen,
) => {
    if (answer[answerType] !== undefined) {
        switch (answerType) {
            case 'boolean':
                result.answerBoolean = answer[answerType];
                break;
            case 'decimal':
                result.answerDecimal = answer[answerType];
                break;
            case 'integer':
                result.answerInteger = answer[answerType];
                break;
            case 'date':
                result.answerDate = answer[answerType];
                break;
            case 'dateTime':
                result.answerDateTime = answer[answerType];
                break;
            case 'time':
                result.answerTime = answer[answerType];
                break;
            case 'string':
                result.answerString = answer[answerType];
                break;
            case 'Coding':
                result.answerCoding = answer[answerType];
                break;
            case 'Quantity':
                result.answerQuantity = answer[answerType] as QuantityFHIR;
                break;
            case 'Reference':
                const answerReference = {
                    ...answer[answerType],
                    reference: `${answer[answerType]?.resourceType}/${answer[answerType]?.id}`,
                };
                delete answerReference.id;
                delete answerReference.resourceType;
                result.answerReference = answerReference;
                break;
            default:
                break;
        }
    }
};

function processMacro(item: any) {
    const macroExtension = {
        url: 'https://beda.software/fhir-emr-questionnaire/macro',
        valueString: item.macro,
    };

    item.extension = item.extension || [];
    item.extension.push(macroExtension);
    delete item.macro;
}

function processItemControl(item: any) {
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

function processStart(item: any) {
    const startExtension = {
        url: 'https://beda.software/fhir-emr-questionnaire/slider-start',
        valueInteger: item.start,
    };
    item.extension = item.extension || [];
    item.extension.push(startExtension);
    delete item.start;
}

function processStop(item: any) {
    const stopExtension = {
        url: 'https://beda.software/fhir-emr-questionnaire/slider-stop',
        valueInteger: item.stop,
    };
    item.extension = item.extension || [];
    item.extension.push(stopExtension);
    delete item.stop;
}

function processHelpText(item: any) {
    const helpTextExtension = {
        url: 'https://beda.software/fhir-emr-questionnaire/help-text',
        valueString: item.helpText,
    };
    item.extension = item.extension || [];
    item.extension.push(helpTextExtension);
    delete item.helpText;
}

function processStopLabel(item: any) {
    const stopLabelExtension = {
        url: 'https://beda.software/fhir-emr-questionnaire/slider-stop-label',
        valueString: item.stopLabel,
    };
    item.extension = item.extension || [];
    item.extension.push(stopLabelExtension);
    delete item.stopLabel;
}

function processSliderStepValue(item: any) {
    const sliderStepValueExtension = {
        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
        valueInteger: item.sliderStepValue,
    };
    item.extension = item.extension || [];
    item.extension.push(sliderStepValueExtension);
    delete item.sliderStepValue;
}

function processAdjustLastToRight(item: any) {
    const adjustLastToRightExtension = {
        url: 'https://beda.software/fhir-emr-questionnaire/adjust-last-to-right',
        valueBoolean: item.adjustLastToRight,
    };
    item.extension = item.extension || [];
    item.extension.push(adjustLastToRightExtension);
    delete item.adjustLastToRight;
}

function processAnswerOption(item: any) {
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

function processHidden(item: any) {
    const hiddenExtension = {
        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
        valueBoolean: item.hidden,
    };
    item.extension = item.extension || [];
    item.extension.push(hiddenExtension);
    delete item.hidden;
}

function processEnableWhen(item: any) {
    item.enableWhen = item.enableWhen?.map((item: FCEQuestionnaireItemEnableWhen) => {
        const { question, operator, answer } = item;
        const result: FHIRQuestionnaireItemEnableWhen = {
            question,
            operator: operator as 'exists' | '=' | '!=' | '>' | '<' | '>=' | '<=',
        };

        if (!answer) {
            return result;
        }

        const answerTypes = [
            'boolean',
            'decimal',
            'integer',
            'date',
            'dateTime',
            'time',
            'string',
            'Coding',
            'Quantity',
            'Reference',
        ];

        answerTypes.forEach((answerType) => {
            convertEnableWhen(answer, answerType, result);
        });

        return result;
    });
}

function processInitialExpression(item: any) {
    const extension = {
        url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
        valueExpression: item.initialExpression,
    };
    item.extension = item.extension || [];
    item.extension.push(extension);
    delete item.initialExpression;
}

function processItemPopulationContext(item: any) {
    const itemPopulationContextExtension = {
        url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext',
        valueExpression: item.itemPopulationContext,
    };
    item.extension = item.extension || [];
    item.extension.push(itemPopulationContextExtension);
    delete item.itemPopulationContext;
}

function processInitial(item: any) {
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

function processChoiceColumn(item: any) {
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

function processAnswerExpression(item: any) {
    const extension = {
        url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression',
        valueExpression: item.answerExpression,
    };
    item.extension = item.extension || [];
    item.extension.push(extension);
    delete item.answerExpression;
}

function processReferenceResource(item: any) {
    const referenceResourceExtension = {
        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
        valueCode: item.referenceResource[0],
    };
    item.extension = item.extension || [];
    item.extension.push(referenceResourceExtension);
    delete item.referenceResource;
}

function processUnit(item: any) {
    const unitExtension = {
        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit', // unit url ?
        valueCoding: item.unit,
    };
    item.extension = item.extension || [];
    item.extension.push(unitExtension);
    delete item.unit;
}

function processCalculatedExpression(item: any) {
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

function processEnableWhenExpression(item: any) {
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
