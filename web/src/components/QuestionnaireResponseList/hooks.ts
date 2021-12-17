import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { SearchParams } from 'aidbox-react/lib/services/search';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { QuestionnaireResponse, Encounter, Patient } from 'shared/src/contrib/aidbox';

export function useQuestionnaireResponseDataList(searchParams: SearchParams) {
    const [questionnaireResponseDataListRD] = useService(async () => {
        const response = await getFHIRResources<QuestionnaireResponse | Encounter | Patient>(
            'QuestionnaireResponse',
            {
                ...searchParams,
                _include: [
                    'QuestionnaireResponse:encounter:Encounter',
                    'QuestionnaireResponse:subject:Patient',
                    'QuestionnaireResponse:subject:Patient',
                ],
            },
        );
        return mapSuccess(response, (bundle) => {
            const sourceMap = extractBundleResources(bundle);
            const questionnaireResponseList = sourceMap.QuestionnaireResponse;
            const encounterList = sourceMap.Encounter;
            const patientList = sourceMap.Patient;
            return questionnaireResponseList.map((questionnaireResponse) => {
                const encounter = encounterList.find(
                    (enc) => enc.id === questionnaireResponse.encounter?.id,
                );
                const patient = patientList.find(
                    (enc) => enc.id === questionnaireResponse.subject?.id,
                );
                return { questionnaireResponse, encounter, patient };
            });
        });
    });
    return questionnaireResponseDataListRD;
}
