import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';
import cloneDeep from 'lodash/cloneDeep';

import { Questionnaire as FCEQuestionnaire } from '@beda.software/aidbox-types';

import { processExtensions } from './processExtensions';
import { processItems } from './processItems';
import { processMeta } from './processMeta';

export function convertQuestionnaire(questionnaire: FCEQuestionnaire): FHIRQuestionnaire {
    questionnaire = cloneDeep(questionnaire);
    questionnaire.meta = questionnaire.meta ? processMeta(questionnaire.meta) : questionnaire.meta;
    questionnaire.item = processItems(questionnaire.item ?? []);
    return processExtensions(questionnaire) as FHIRQuestionnaire;
}
