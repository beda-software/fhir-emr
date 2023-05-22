import { Extension as FHIRExtension } from 'fhir/r4b';

import { QuestionnaireItem as FCEQuestionnaireItem } from 'shared/src/contrib/aidbox';

export enum ExtensionIdentifier {
    Hidden = 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
    ItemControl = 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    SliderStepValue = 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
    Unit = 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
    ReferenceResource = 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',

    ItemPopulationContext = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext',
    InitialExpression = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
    ChoiceColumn = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn',
    CalculatedExpression = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
    EnableWhenExpression = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression',
    AnswerExpression = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression',

    AdjustLastToRight = 'https://beda.software/fhir-emr-questionnaire/adjust-last-to-right',
    SliderStart = 'https://beda.software/fhir-emr-questionnaire/slider-start',
    SliderStop = 'https://beda.software/fhir-emr-questionnaire/slider-stop',
    HelpText = 'https://beda.software/fhir-emr-questionnaire/help-text',
    StopLabel = 'https://beda.software/fhir-emr-questionnaire/slider-stop-label',
    Macro = 'https://beda.software/fhir-emr-questionnaire/macro',
}

type ExtensionTransformer = {
    [key in ExtensionIdentifier]:
        | {
              transform: {
                  fromFHIR: (extension: FHIRExtension) => Partial<FCEQuestionnaireItem> | undefined;
                  toFHIR: (item: FCEQuestionnaireItem) => Omit<FHIRExtension, 'url'> | undefined;
              };
          }
        | {
              path: {
                  FHIR: keyof FHIRExtension;
                  FCE: keyof FCEQuestionnaireItem;
              };
          };
};

export const extensionTransformers: ExtensionTransformer = {
    'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden': {
        path: { FHIR: 'valueBoolean', FCE: 'hidden' },
    },
    'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl': {
        path: { FHIR: 'valueCodeableConcept', FCE: 'itemControl' },
    },
    'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue': {
        path: { FHIR: 'valueInteger', FCE: 'sliderStepValue' },
    },
    'http://hl7.org/fhir/StructureDefinition/questionnaire-unit': {
        path: { FHIR: 'valueCoding', FCE: 'unit' },
    },
    'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource': {
        transform: {
            fromFHIR: (extension) => {
                if (extension.valueCode) {
                    return { referenceResource: [extension.valueCode] };
                } else {
                    return {};
                }
            },
            toFHIR: (item) => {
                if (item.referenceResource?.length) {
                    return {
                        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
                        valueCode: item.referenceResource[0],
                    };
                }
            },
        },
    },

    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemPopulationContext': {
        path: { FHIR: 'valueExpression', FCE: 'itemPopulationContext' },
    },
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression': {
        path: { FHIR: 'valueExpression', FCE: 'initialExpression' },
    },
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression': {
        path: { FHIR: 'valueExpression', FCE: 'calculatedExpression' },
    },
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression': {
        path: { FHIR: 'valueExpression', FCE: 'enableWhenExpression' },
    },
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression': {
        path: { FHIR: 'valueExpression', FCE: 'answerExpression' },
    },
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn': {
        transform: {
            fromFHIR: (extension) => {
                const choiceColumnExtension = extension.extension;

                if (choiceColumnExtension) {
                    const forDisplay = choiceColumnExtension.find((obj) => obj.url === 'forDisplay')?.valueBoolean;
                    const path = choiceColumnExtension.find((obj) => obj.url === 'path')?.valueString;
                    const choiceColumnArray = [];
                    choiceColumnArray.push({
                        forDisplay: forDisplay ?? false,
                        path,
                    });
                    return { choiceColumn: choiceColumnArray };
                } else {
                    return {};
                }
            },
            toFHIR: (item) => {
                if (item.choiceColumn) {
                    return {
                        url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-choiceColumn',
                        extension: [
                            {
                                url: 'forDisplay',
                                valueBoolean: item.choiceColumn[0]?.forDisplay,
                            },
                            {
                                url: 'path',
                                valueString: item.choiceColumn[0]?.path,
                            },
                        ],
                    };
                }
            },
        },
    },

    'https://beda.software/fhir-emr-questionnaire/adjust-last-to-right': {
        path: { FHIR: 'valueBoolean', FCE: 'adjustLastToRight' },
    },
    'https://beda.software/fhir-emr-questionnaire/slider-start': {
        path: { FHIR: 'valueInteger', FCE: 'start' },
    },
    'https://beda.software/fhir-emr-questionnaire/slider-stop': {
        path: { FHIR: 'valueInteger', FCE: 'stop' },
    },
    'https://beda.software/fhir-emr-questionnaire/help-text': {
        path: { FHIR: 'valueString', FCE: 'helpText' },
    },
    'https://beda.software/fhir-emr-questionnaire/slider-stop-label': {
        path: { FHIR: 'valueString', FCE: 'stopLabel' },
    },
    'https://beda.software/fhir-emr-questionnaire/macro': {
        path: { FHIR: 'valueString', FCE: 'macro' },
    },
};
