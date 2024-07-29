import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

export function processMeta(fhirQuestionnaire: FHIRQuestionnaire) {
    const createdAt = getCreatedAt(fhirQuestionnaire);
    return {
        ...fhirQuestionnaire.meta,
        ...createdAt,
        extension: undefined,
    };
}

function getCreatedAt(fhirQuestionnaire: FHIRQuestionnaire) {
    const metaExtension = fhirQuestionnaire.meta?.extension?.find((ext) => ext.url === 'ex:createdAt');
    return metaExtension ? { createdAt: metaExtension.valueInstant } : {};
}
