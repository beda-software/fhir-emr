import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Questionnaire } from 'shared/src/contrib/aidbox';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { useDebounce } from 'src/utils/debounce';

export function useQuestionnaireList(filterValues: StringTypeColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const [questionnaireResponse, questionnaireResponseManager] = useService(async () => {
        const questionnaireFilterValue = debouncedFilterValues[0];

        return mapSuccess(
            await getFHIRResources<Questionnaire>('Questionnaire', {
                ...(questionnaireFilterValue ? { name: questionnaireFilterValue.value } : {}),
            }),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        );
    }, [debouncedFilterValues]);

    return { questionnaireResponse, questionnaireResponseManager };
}
