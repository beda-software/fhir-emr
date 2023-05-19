import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';
import cloneDeep from 'lodash/cloneDeep';

import { Questionnaire as FCEQuestionnaire } from 'shared/src/contrib/aidbox';

import { processExtensions } from './processExtensions';
import { processItems } from './processItems';
import { processMeta } from './processMeta';
import { checkFhirQuestionnaireProfile, trimUndefined } from './utils';

export function convertQuestionnaire(fhirQuestionnaire: FHIRQuestionnaire) {
    checkFhirQuestionnaireProfile(fhirQuestionnaire);
    fhirQuestionnaire = cloneDeep(fhirQuestionnaire);
    const meta = processMeta(fhirQuestionnaire);
    const item = processItems(fhirQuestionnaire);
    const extensions = processExtensions(fhirQuestionnaire);
    const questionnaire = trimUndefined({
        ...fhirQuestionnaire,
        meta,
        item,
        ...extensions,
        extension: undefined,
    });
    return questionnaire as unknown as FCEQuestionnaire;
}
