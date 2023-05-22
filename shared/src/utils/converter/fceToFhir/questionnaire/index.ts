import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';
import cloneDeep from 'lodash/cloneDeep';

import { Questionnaire as FCEQuestionnaire } from 'shared/src/contrib/aidbox';

import { processExtensions } from './processExtensions';
import { processItems } from './processItems';
import { processMeta } from './processMeta';

export function convertQuestionnaire(questionnaire: FCEQuestionnaire): FHIRQuestionnaire {
    questionnaire = cloneDeep(questionnaire);
    processMeta(questionnaire.meta);
    questionnaire.item = processItems(questionnaire.item ?? []);
    processExtensions(questionnaire);
    return questionnaire as unknown as FHIRQuestionnaire;
}
