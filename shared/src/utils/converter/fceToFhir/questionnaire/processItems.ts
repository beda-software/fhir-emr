import { Quantity as QuantityFHIR, QuestionnaireItemEnableWhen as FHIRQuestionnaireItemEnableWhen } from 'fhir/r4b';

import {
    QuestionnaireItem as FCEQuestionnaireItem,
    QuestionnaireItemEnableWhen as FCEQuestionnaireItemEnableWhen,
    QuestionnaireItemEnableWhenAnswer as FCEQuestionnaireItemEnableWhenAnswer,
} from 'shared/src/contrib/aidbox';
import { convertFromFHIRExtension, convertToFHIRExtension, toFHIRReference } from 'shared/src/utils/converter';

export function processItems(items: FCEQuestionnaireItem[]) {
    if (!items) {
        return;
    }
    items.forEach((item) => {
        const extensions = convertToFHIRExtension(item);
        if (extensions.length > 0) {
            const fieldsToOmit = extensions
                .map(convertFromFHIRExtension)
                .filter((ext): ext is Partial<FCEQuestionnaireItem> => ext !== undefined)
                .flatMap(Object.keys);
            for (const field of fieldsToOmit) {
                delete item[field];
            }
            item.extension = extensions.sort();
        }

        if (item.answerOption !== undefined) {
            processAnswerOption(item);
        }

        if (item.enableWhen !== undefined) {
            processEnableWhen(item);
        }

        if (item.initial) {
            processInitial(item);
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
            option.valueReference = toFHIRReference(option.value.Reference);
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
