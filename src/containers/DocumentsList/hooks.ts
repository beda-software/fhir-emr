import { Reference, Patient, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';

import { useService } from 'fhir-react/lib/hooks/service';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { parseFHIRReference } from 'fhir-react/lib/utils/fhir';

export function usePatientDocuments(patient: Patient, encounter?: Reference) {
    const [response] = useService(async () => {
        const qrResponse = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
            subject: patient.id,
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
                    (q) => (questionnaireNameById[q.id!] = q.title || q.name || 'Unknown'),
                );

                qrResponseExtracted.data.QuestionnaireResponse.forEach((qr) => {
                    const remoteName = questionnaireNameById[qr.questionnaire!];
                    if (remoteName) {
                        questionnaireNames[qr.id!] = remoteName;
                    } else {
                        const e = qr._questionnaire?.extension?.find(
                            ({ url }) => url === 'http://hl7.org/fhir/StructureDefinition/display',
                        );
                        if (e) {
                            questionnaireNames[qr.id!] = e.valueString ?? 'Unknown';
                        }
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
