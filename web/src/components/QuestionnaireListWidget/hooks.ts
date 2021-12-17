import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { SearchParams } from 'aidbox-react/lib/services/search';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Questionnaire } from 'shared/src/contrib/aidbox';

export function useQuestionnaireList(searchParams: SearchParams) {
    const [questionnaireListRD] = useService(async () => {
        const response = await getFHIRResources<Questionnaire>('Questionnaire', {});
        return mapSuccess(response, (bundle) => extractBundleResources(bundle).Questionnaire);
    });
    return questionnaireListRD;
}
