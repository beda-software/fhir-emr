import { useService } from 'fhir-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { SearchParams } from 'fhir-react/lib/services/search';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { Questionnaire } from 'fhir/r4b';

export function useQuestionnaireList(searchParams: SearchParams) {
    const [questionnaireListRD] = useService(async () => {
        const response = await getFHIRResources<Questionnaire>('Questionnaire', {});
        return mapSuccess(response, (bundle) => extractBundleResources(bundle).Questionnaire);
    });
    return questionnaireListRD;
}
