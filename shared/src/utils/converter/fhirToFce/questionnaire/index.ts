import { Questionnaire as FCEQuestionnaire } from 'shared/src/contrib/aidbox';

import { processExtensions } from './processExtensions';
import { processItems } from './processItems';
import { processMeta } from './processMeta';
import { checkFhirQuestionnaireProfile, trimUndefined } from './utils';

export const convertQuestionnaire = (fhirResource: any) => {
    const fhirQuestionnaire = JSON.parse(JSON.stringify(fhirResource));
    checkFhirQuestionnaireProfile(fhirQuestionnaire);
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
};
