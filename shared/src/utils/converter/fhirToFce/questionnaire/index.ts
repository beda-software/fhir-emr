import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';
import cloneDeep from 'lodash/cloneDeep';

import { Questionnaire as FCEQuestionnaire } from 'shared/src/contrib/aidbox';

import { checkFhirQuestionnaireProfile, trimUndefined } from '../utils';
import { processExtensions } from './processExtensions';
import { processItems } from './processItems';
import { processMeta } from './processMeta';

export function convertQuestionnaire(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire {
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
