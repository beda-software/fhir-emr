import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

import { processExtensions } from './processExtensions';
import { processItems } from './processItems';
import { processMeta } from './processMeta';

export const convertQuestionnaire = (fceResource: any) => {
    const questionnaire = JSON.parse(JSON.stringify(fceResource));
    processMeta(questionnaire.meta);
    processItems(questionnaire.item);
    processExtensions(questionnaire);
    return questionnaire as unknown as FHIRQuestionnaire;
};
