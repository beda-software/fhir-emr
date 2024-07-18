import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'fhir/r4b';
import { evaluate } from 'fhirpath';
import { useParams } from 'react-router-dom';

import { success } from 'aidbox-react/lib/libs/remoteData';

import { useService } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';

export function usePatientDocumentPrint() {
    const params = useParams<{ qrId: string }>();
    const qrId = params.qrId!;

    const [response] = useService(async () => {
        const qrRD = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
            _id: qrId,
        });
        if (isSuccess(qrRD)) {
            const questionnaireResponse = evaluate(qrRD.data, 'entry.resource')[0];
            const qRD = await getFHIRResources<Questionnaire>('Questionnaire', {
                id: questionnaireResponse.questionnaire,
            });
            if (isSuccess(qRD)) {
                const questionnaire = evaluate(qRD.data, 'entry.resource')[0];
                return success({ questionnaireResponse, questionnaire });
            }
            return { questionnaireResponse };
        }
        return { qrRD };
    });

    return { response };
}

export function findQRItemValue(linkId: string, type = 'String') {
    return `repeat(item).where(linkId='${linkId}').answer.value${type}`;
}

export function getQuestionnaireItemValue(
    questionnaireItem: QuestionnaireItem,
    questionnaireResponse: QuestionnaireResponse,
) {
    switch (questionnaireItem.type) {
        case 'display':
        case 'group':
            return '';
        case 'text':
        case 'string':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'String'))[0];
        case 'decimal':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'Decimal'))[0];
        case 'integer':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'Integer'))[0];
        case 'date':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'Date'))[0];
        case 'dateTime':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'DateTime'))[0];
        case 'time':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'Time'))[0];
        case 'choice':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'Coding.display'))[0];
        case 'boolean':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'Boolean'))[0];
        case 'reference':
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId, 'Reference.display'))[0];
        default:
            return evaluate(questionnaireResponse, findQRItemValue(questionnaireItem.linkId))[0];
    }
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
