import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { extractBundleResources, useService, WithId } from '@beda.software/fhir-react';
import { failure, isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResource, getFHIRResources } from 'src/services/fhir';

interface QuestionnaireResponseWithQuestionnaire {
    questionnaireResponse: WithId<QuestionnaireResponse>;
    questionnaire: WithId<Questionnaire>;
}

export function usePatientDocumentPrint() {
    const params = useParams<{ qrId: string; id: string }>();
    const qrId = params.qrId!;
    const patientId = params.id!;

    const [response] = useService<QuestionnaireResponseWithQuestionnaire>(async () => {
        const questionnaireResponseRD = mapSuccess(
            await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                _id: qrId,
                subject: patientId,
            }),
            (qrRD) => {
                return extractBundleResources<WithId<QuestionnaireResponse>>(qrRD).QuestionnaireResponse[0];
            },
        );

        if (!isSuccess(questionnaireResponseRD)) {
            return failure('QuestionnaireResponse not found');
        }

        const questionnaireResponse = questionnaireResponseRD.data;
        if (!questionnaireResponse) {
            return failure('QuestionnaireResponse not found');
        }

        const questionnaireId = questionnaireResponse.questionnaire;
        if (!questionnaireId) {
            return failure('QuestionnaireResponse does not have questionnaire');
        }

        return mapSuccess(
            await getFHIRResource<Questionnaire>({
                reference: `Questionnaire/${questionnaireResponse.questionnaire}`,
            }),
            // TODO: it is better to use '_include' to get questionnaire, but currently server does not return it
            // Maybe this thread can help (https://github.com/hapifhir/hapi-fhir/issues/2843)
            (questionnaire) => ({ questionnaireResponse, questionnaire }),
        );
    });

    return response;
}
