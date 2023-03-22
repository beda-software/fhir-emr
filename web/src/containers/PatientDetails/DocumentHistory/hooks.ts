import { useParams } from 'react-router-dom';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, resolveMap } from 'aidbox-react/lib/services/service';

import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { loadResourceHistory } from 'src/services/history';
import { getProvenanceByEntity } from 'src/services/provenance';

export function useDocumentHistory() {
    const params = useParams<{ qrId: string }>();
    const qrId = params.qrId!;

    const [response] = useService(async () => {
        const provenanceResponse = mapSuccess(
            await resolveMap({
                provenanceList: getProvenanceByEntity(`QuestionnaireResponse/${qrId}`),
                qrHistoryBundle: loadResourceHistory<QuestionnaireResponse>({
                    id: qrId,
                    resourceType: 'QuestionnaireResponse',
                }),
            }),
            ({ provenanceList, qrHistoryBundle }) => {
                const qrHistory =
                    extractBundleResources<QuestionnaireResponse>(
                        qrHistoryBundle,
                    ).QuestionnaireResponse;

                return {
                    provenanceList: provenanceList.sort((a, b) =>
                        a.recorded.localeCompare(b.recorded),
                    ),
                    qrHistory,
                };
            },
        );

        if (isSuccess(provenanceResponse)) {
            const questionnaireId = provenanceResponse.data.qrHistory[0]?.questionnaire!;

            return mapSuccess(
                await resolveMap({
                    questionnaire: getFHIRResource<Questionnaire>({
                        resourceType: 'Questionnaire',
                        id: questionnaireId,
                    }),
                }),
                ({ questionnaire }) => {
                    return {
                        ...provenanceResponse.data,
                        questionnaire: {
                            ...questionnaire,
                            item: questionnaire.item?.filter((i) => !i.hidden),
                        },
                    };
                },
            );
        } else {
            return provenanceResponse;
        }
    }, [qrId]);

    return { response };
}
