import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import {
    AidboxReference,
    Encounter,
    Patient,
    Questionnaire,
    QuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

export function usePatientDocuments(patient: Patient, encounter?: AidboxReference<Encounter>) {
    const [response] = useService(async () => {
        const qrResponse = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
            source: patient.id,
            encounter: encounter?.id,
        });

        const qrResponseExtracted = mapSuccess(qrResponse, (bundle) => ({
            QuestionnaireResponse: extractBundleResources(bundle).QuestionnaireResponse,
        }));

        if (isSuccess(qrResponseExtracted)) {
            const ids = qrResponseExtracted.data.QuestionnaireResponse.map(
                (qr) => qr.questionnaire,
            ).filter((q) => q !== undefined);

            const qResponse = await getFHIRResources<Questionnaire>('Questionnaire', {
                id: ids.join(','),
            });

            return mapSuccess(qResponse, (bundle) => {
                let questionnaireNames: { [key: string]: string | undefined } = {};
                extractBundleResources(bundle).Questionnaire.forEach(
                    (q) => (questionnaireNames[q.id!] = q.name),
                );

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
