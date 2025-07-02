import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { success } from 'aidbox-react/lib/libs/remoteData';

import { useService } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';
import { evaluate } from 'src/utils';

export function usePatientDocumentPrint() {
    const params = useParams<{ qrId: string; id: string }>();
    const qrId = params.qrId!;
    const patientId = params.id!;

    const [response] = useService(async () => {
        const qrRD = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
            _id: qrId,
            subject: patientId,
        });
        if (isSuccess(qrRD)) {
            const questionnaireResponse = evaluate(qrRD.data, 'entry.resource')[0];
            const qRD = await getFHIRResources<Questionnaire>('Questionnaire', {
                id: questionnaireResponse.questionnaire,
                // TODO: it is better to use '_include' to get questionnaire, but currently server does not return it
                // Maybe this thread can help (https://github.com/hapifhir/hapi-fhir/issues/2843)
            });
            if (isSuccess(qRD)) {
                const questionnaire = evaluate(qRD.data, 'entry.resource')[0];
                return success({ questionnaireResponse, questionnaire });
            }
            return questionnaireResponse;
        }
        return qrRD;
    });

    return { response };
}
