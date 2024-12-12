import { t } from '@lingui/macro';
import { Reference, Patient, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';

import { extractBundleResources, parseFHIRReference, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';
import { evaluate } from 'src/utils';
import { getExternalQuestionnaireName } from 'src/utils/smart-apps';

export function usePatientDocuments(patient: Patient, encounter?: Reference, context?: string) {
    const [response] = useService(async () => {
        let questionnaires: string[] = [];
        if (context) {
            const r = await getFHIRResources<Questionnaire>('Questionnaire', { context, _elements: 'id' });
            if (isSuccess(r)) {
                questionnaires = evaluate(r.data, 'Bundle.entry.resource.id') ?? [];
            }
        }
        const qrResponse = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
            subject: patient.id,
            questionnaire: questionnaires.join(','),
            encounter: encounter ? parseFHIRReference(encounter).id : undefined,
            _sort: '-authored',
        });

        const qrResponseExtracted = mapSuccess(qrResponse, (bundle) => ({
            QuestionnaireResponse: extractBundleResources(bundle).QuestionnaireResponse,
        }));

        if (isSuccess(qrResponseExtracted)) {
            const ids = qrResponseExtracted.data.QuestionnaireResponse.map((qr) => qr.questionnaire).filter(
                (q) => q !== undefined,
            );

            const qResponse = await getFHIRResources<Questionnaire>('Questionnaire', {
                id: ids.join(','),
            });

            return mapSuccess(qResponse, (bundle) => {
                const questionnaireNames: { [key: string]: string } = {};
                const questionnaireNameById: { [key: string]: string } = {};
                extractBundleResources(bundle).Questionnaire.forEach(
                    (q) => (questionnaireNameById[q.id!] = q.title || q.name || t`Unknown`),
                );

                qrResponseExtracted.data.QuestionnaireResponse.forEach((qr) => {
                    const remoteName = questionnaireNameById[qr.questionnaire!];
                    if (remoteName) {
                        questionnaireNames[qr.id!] = remoteName;
                    } else {
                        questionnaireNames[qr.id!] = getExternalQuestionnaireName(qr) || t`Unknown`;
                    }
                });

                return {
                    ...qrResponseExtracted.data,
                    questionnaireNames,
                };
            });
        }

        return qrResponseExtracted;
    });

    return { response };
}
