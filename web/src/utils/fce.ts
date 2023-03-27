import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

import { Questionnaire as AidboxQuestionnaire } from 'shared/src/contrib/aidbox';

export function toFirstClassExtension(q: FHIRQuestionnaire): AidboxQuestionnaire {
    if (
        !(
            (q.meta?.profile?.length ?? 0) == 1 &&
            q.meta?.profile?.[0] == 'https://beda.software/beda-emr-questionnaire'
        )
    ) {
        throw new Error('Only beda emr questionanire supported');
    }
    return q as unknown as AidboxQuestionnaire;
}
