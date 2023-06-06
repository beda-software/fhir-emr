import { useService } from 'fhir-react/lib/hooks/service';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { parseFHIRReference } from 'fhir-react/lib/utils/fhir';
import { Reference, Patient, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';

export function usePatientDocuments(patient: Patient, encounter?: Reference) {
    const [response] = useService(async () => {
        const qrResponse = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
            source: patient.id,
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
                let questionnaireNames: { [key: string]: string | undefined } = {};
                extractBundleResources(bundle).Questionnaire.forEach(
                    (q) => (questionnaireNames[q.id!] = q.title || q.name),
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
