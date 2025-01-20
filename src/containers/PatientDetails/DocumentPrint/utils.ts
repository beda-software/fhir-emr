import { QuestionnaireItem, QuestionnaireResponse } from 'fhir/r4b';

import { compileAsFirst } from 'src/utils';

export const qItemIsHidden = compileAsFirst<QuestionnaireItem, boolean>(
    "extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-hidden').exists() and extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-hidden').valueBoolean=true",
);

const getQrItemValueByLinkIdAndType = (linkId: string, type: string) =>
    compileAsFirst<QuestionnaireResponse, string>(`repeat(item).where(linkId='${linkId}').answer.value${type}`);

const questionnaireItemValueTypeMap: Record<QuestionnaireItem['type'], string> = {
    display: 'String',
    group: 'String',
    text: 'String',
    string: 'String',
    decimal: 'Decimal',
    integer: 'Integer',
    date: 'Date',
    dateTime: 'DateTime',
    time: 'Time',
    choice: 'Coding.display',
    boolean: 'Boolean',
    reference: 'Reference.display',
    'open-choice': '',
    attachment: '',
    quantity: '',
    question: '',
    url: '',
};

export function getQuestionnaireItemValue(
    questionnaireItem: QuestionnaireItem,
    questionnaireResponse: QuestionnaireResponse,
) {
    return getQrItemValueByLinkIdAndType(
        questionnaireItem.linkId,
        questionnaireItemValueTypeMap[questionnaireItem.type],
    )(questionnaireResponse);
}

export function flattenQuestionnaireGroupItems(item: QuestionnaireItem): QuestionnaireItem[] {
    if (item.type !== 'group') {
        return [item];
    } else {
        const extractedItems = item.item
            ? item.item.map((internalItem) => {
                  if (internalItem.type === 'group') {
                      return flattenQuestionnaireGroupItems(internalItem);
                  }
                  return [internalItem];
              })
            : [];
        return [...extractedItems.flat()];
    }
}
