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

export type ExtensionTransformer = {
    [key in ExtensionIdentifier]:
        | {
              transform: {
                  fromExtension: (extension: FHIRExtension) => Partial<FCEQuestionnaireItem> | undefined;
                  toExtension: (item: FCEQuestionnaireItem) => FHIRExtension | undefined;
              };
          }
        | {
              path: {
                  extension: keyof FHIRExtension;
                  questionnaire: keyof FCEQuestionnaireItem;
              };
          };
};

export const extensionTransformers: ExtensionTransformer = {
    [ExtensionIdentifier.Hidden]: {
        path: { extension: 'valueBoolean', questionnaire: 'hidden' },
    },
    [ExtensionIdentifier.ItemControl]: {
        path: { extension: 'valueCodeableConcept', questionnaire: 'itemControl' },
    },
    [ExtensionIdentifier.SliderStepValue]: {
        path: { extension: 'valueInteger', questionnaire: 'sliderStepValue' },
    },
    [ExtensionIdentifier.Unit]: {
        path: { extension: 'valueCoding', questionnaire: 'unit' },
    },
    [ExtensionIdentifier.ReferenceResource]: {
        transform: {
            fromExtension: (extension) => {
                if (extension.valueCode) {
                    return { referenceResource: [extension.valueCode] };
                } else {
                    return {};
                }
            },
            toExtension: (item) => {
                if (item.referenceResource?.length) {
                    return {
                        url: ExtensionIdentifier.ReferenceResource,
                        valueCode: item.referenceResource[0],
                    };
                }
            },
        },
    },

    [ExtensionIdentifier.ItemPopulationContext]: {
        path: { extension: 'valueExpression', questionnaire: 'itemPopulationContext' },
    },
    [ExtensionIdentifier.InitialExpression]: {
        path: { extension: 'valueExpression', questionnaire: 'initialExpression' },
    },
    [ExtensionIdentifier.CalculatedExpression]: {
        path: { extension: 'valueExpression', questionnaire: 'calculatedExpression' },
    },
    [ExtensionIdentifier.EnableWhenExpression]: {
        path: { extension: 'valueExpression', questionnaire: 'enableWhenExpression' },
    },
    [ExtensionIdentifier.AnswerExpression]: {
        path: { extension: 'valueExpression', questionnaire: 'answerExpression' },
    },
    [ExtensionIdentifier.ChoiceColumn]: {
        transform: {
            fromExtension: (extension) => {
                const choiceColumnExtension = extension.extension;
                if (choiceColumnExtension) {
                    return {
                        choiceColumn: [
                            {
                                forDisplay:
                                    choiceColumnExtension.find((obj) => obj.url === 'forDisplay')?.valueBoolean ??
                                    false,
                                path: choiceColumnExtension.find((obj) => obj.url === 'path')?.valueString,
                            },
                        ],
                    };
                }
            },
            toExtension: (item) => {
                if (item.choiceColumn) {
                    return {
                        url: ExtensionIdentifier.ChoiceColumn,
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

    [ExtensionIdentifier.AdjustLastToRight]: {
        path: { extension: 'valueBoolean', questionnaire: 'adjustLastToRight' },
    },
    [ExtensionIdentifier.SliderStart]: {
        path: { extension: 'valueInteger', questionnaire: 'start' },
    },
    [ExtensionIdentifier.SliderStop]: {
        path: { extension: 'valueInteger', questionnaire: 'stop' },
    },
    [ExtensionIdentifier.HelpText]: {
        path: { extension: 'valueString', questionnaire: 'helpText' },
    },
    [ExtensionIdentifier.StopLabel]: {
        path: { extension: 'valueString', questionnaire: 'stopLabel' },
    },
    [ExtensionIdentifier.Macro]: {
        path: { extension: 'valueString', questionnaire: 'macro' },
    },
};
