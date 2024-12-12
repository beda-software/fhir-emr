import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useParams } from 'react-router-dom';
import { fromFirstClassExtension, toFirstClassExtension } from 'sdc-qrf';

import { Provenance } from '@beda.software/aidbox-types';
import { WithId, extractBundleResources, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess, resolveMap } from '@beda.software/remote-data';

import { getFHIRResource } from 'src/services/fhir';
import { loadResourceHistory } from 'src/services/history';
import { getProvenanceByEntity } from 'src/services/provenance';

export function useDocumentHistory() {
    const params = useParams<{ qrId: string }>();
    const qrId = params.qrId!;

    const [response] = useService(async () => {
        const provenanceResponse = mapSuccess(
            await resolveMap({
                provenanceList: getProvenanceByEntity<WithId<Provenance>>(`QuestionnaireResponse/${qrId}`),
                qrHistoryBundle: loadResourceHistory<QuestionnaireResponse>({
                    reference: `QuestionnaireResponse/${qrId}`,
                }),
            }),
            ({ provenanceList, qrHistoryBundle }) => {
                const qrHistory = extractBundleResources<QuestionnaireResponse>(qrHistoryBundle).QuestionnaireResponse;

                return {
                    provenanceList: provenanceList.sort((a, b) => a.recorded.localeCompare(b.recorded)),
                    qrHistory,
                };
            },
        );

        if (isSuccess(provenanceResponse)) {
            const questionnaireId = provenanceResponse.data.qrHistory[0]!.questionnaire!;

            return mapSuccess(
                await resolveMap({
                    questionnaire: getFHIRResource<Questionnaire>({
                        reference: `Questionnaire/${questionnaireId}`,
                    }),
                }),
                (bundle) => {
                    const questionnaire = toFirstClassExtension(bundle.questionnaire);
                    return {
                        ...provenanceResponse.data,

                        questionnaire: fromFirstClassExtension({
                            ...questionnaire,
                            item: questionnaire.item?.filter((i) => !i.hidden),
                        }),
                    };
                },
            );
        } else {
            return provenanceResponse;
        }
    }, [qrId]);

    return { response };
}
