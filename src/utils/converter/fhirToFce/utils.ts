import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

export function checkFhirQuestionnaireProfile(fhirQuestionnaire: FHIRQuestionnaire): void {
    if (
        !(
            (fhirQuestionnaire.meta?.profile?.length ?? 0) === 1 &&
            fhirQuestionnaire.meta?.profile?.[0] === 'https://beda.software/beda-emr-questionnaire'
        )
    ) {
        throw new Error('Only beda emr questionanire supported');
    }
}

export function trimUndefined(e: any) {
    for (const prop in e) {
        if (Object.prototype.hasOwnProperty.call(e, prop)) {
            const val = e[prop];
            if (val === undefined) {
                delete e[prop];
            } else if (typeof val === 'object') {
                if (Array.isArray(val)) {
                    for (let i = 0; i < val.length; i++) {
                        if (typeof val[i] === 'object') {
                            trimUndefined(val[i]);
                        }
                    }
                } else {
                    trimUndefined(val);
                }
            }
        }
    }

    return e;
}
