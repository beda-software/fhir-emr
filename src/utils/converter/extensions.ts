import { Extension as FHIRExtension } from 'fhir/r4b';

import { QuestionnaireItem as FCEQuestionnaireItem } from '@beda.software/aidbox-types';

export enum ExtensionIdentifier {
    Hidden = 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
    ItemControl = 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    SliderStepValue = 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
    Unit = 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
    UnitOption = 'http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption',
    ReferenceResource = 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
    EntryFormat = 'http://hl7.org/fhir/StructureDefinition/entryFormat',
    ColumnSize = 'http://aidbox.io/questionnaire-itemColumnSize',
    ItemMedia = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemMedia',
    Regex = 'http://hl7.org/fhir/StructureDefinition/regex',
    ObservationExtract = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract',
    ObservationLinkPeriod = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod',
    MinValue = 'http://hl7.org/fhir/StructureDefinition/minValue',
    MaxValue = 'http://hl7.org/fhir/StructureDefinition/maxValue',
    MinQuantity = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-minQuantity',
    MaxQuantity = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-maxQuantity',
    ShowOrdinalValue = 'http://aidbox.io/questionnaire-showOrdinalValue',
    PreferredTerminologyServer = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-preferredTerminologyServer',
    OpenLabel = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-openLabel',
    BackgroundImage = 'http://aidbox.io/questionnaire-backgroundImage',
    Language = 'http://hl7.org/fhir/StructureDefinition/language',
    ChoiceOrientation = 'http://hl7.org/fhir/StructureDefinition/questionnaire-choiceOrientation',
    InlineChoiceDirection = 'https://beda.software/fhir-emr-questionnaire/inline-choice-direction',
    ChoiceColumns = 'http://aidbox.io/fhir/StructureDefinition/questionnaire-choiceColumns',

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
    RowsNumber = 'https://beda.software/fhir-emr-questionnaire/rows-number',
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
    [ExtensionIdentifier.EntryFormat]: {
        path: { extension: 'valueString', questionnaire: 'entryFormat' },
    },
    [ExtensionIdentifier.Unit]: {
        path: { extension: 'valueCoding', questionnaire: 'unit' },
    },
    [ExtensionIdentifier.UnitOption]: {
        path: { extension: 'valueCoding', questionnaire: 'unitOption' },
    },
    [ExtensionIdentifier.RowsNumber]: {
        path: { extension: 'valueInteger', questionnaire: 'rowsNumber' },
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
    [ExtensionIdentifier.ColumnSize]: {
        path: { extension: 'valueInteger', questionnaire: 'columnSize' },
    },
    [ExtensionIdentifier.ItemMedia]: {
        path: { extension: 'valueAttachment', questionnaire: 'itemMedia' },
    },
    [ExtensionIdentifier.Regex]: {
        path: { extension: 'valueString', questionnaire: 'regex' },
    },
    [ExtensionIdentifier.ObservationExtract]: {
        path: { extension: 'valueBoolean', questionnaire: 'observationExtract' },
    },
    [ExtensionIdentifier.ObservationLinkPeriod]: {
        path: { extension: 'valueDuration', questionnaire: 'observationLinkPeriod' },
    },
    [ExtensionIdentifier.MinValue]: {
        transform: {
            fromExtension: (extension) => ({ minValue: extension }),
            toExtension: (item) => item.minValue,
        },
    },
    [ExtensionIdentifier.MaxValue]: {
        transform: {
            fromExtension: (extension) => ({ maxValue: extension }),
            toExtension: (item) => item.maxValue,
        },
    },
    [ExtensionIdentifier.MinQuantity]: {
        transform: {
            fromExtension: (extension) => ({ minQuantity: extension }),
            toExtension: (item) => item.minQuantity,
        },
    },
    [ExtensionIdentifier.MaxQuantity]: {
        transform: {
            fromExtension: (extension) => ({ maxQuantity: extension }),
            toExtension: (item) => item.maxQuantity,
        },
    },
    [ExtensionIdentifier.ShowOrdinalValue]: {
        path: { extension: 'valueBoolean', questionnaire: 'showOrdinalValue' },
    },
    [ExtensionIdentifier.PreferredTerminologyServer]: {
        path: { extension: 'valueUri', questionnaire: 'preferredTerminologyServer' },
    },
    [ExtensionIdentifier.OpenLabel]: {
        path: { extension: 'valueString', questionnaire: 'openLabel' },
    },
    [ExtensionIdentifier.BackgroundImage]: {
        path: { extension: 'valueAttachment', questionnaire: 'backgroundImage' },
    },
    [ExtensionIdentifier.Language]: {
        path: { extension: 'valueCoding', questionnaire: 'language' },
    },
    [ExtensionIdentifier.ChoiceOrientation]: {
        path: { extension: 'valueCode', questionnaire: 'choiceOrientation' },
    },
    [ExtensionIdentifier.InlineChoiceDirection]: {
        path: { extension: 'valueString', questionnaire: 'choiceOrientation' },
    },
    [ExtensionIdentifier.ChoiceColumns]: {
        path: { extension: 'valueInteger', questionnaire: 'choiceColumns' },
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
