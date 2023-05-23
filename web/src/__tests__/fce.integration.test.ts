import { readdirSync } from 'fs';
import { parse as parsePath } from 'path';

import { getFHIRResource } from 'fhir-react/lib/services/fhir';
import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

import { getFHIRResource as getFCEResource } from 'aidbox-react/lib/services/fhir';
import { ensure } from 'aidbox-react/lib/utils/tests';

import { Questionnaire as FCEQuestionnaire } from 'shared/src/contrib/aidbox';
import { toFirstClassExtension, fromFirstClassExtension } from 'shared/src/utils/converter';
import { sortExtensionsList } from 'shared/src/utils/converter/__tests__/fce.test';

import { loginAdminUser } from 'src/setupTests';

describe('Questionanire and QuestionnaireResponses transformation', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    const filenames = readdirSync('../resources/seeds/Questionnaire').map((filename) => parsePath(filename).name);

    test.each(filenames)('Questionnaires %s should be converted to FHIR and back to FCE', async (questionnaireId) => {
        const questionnaire = ensure(
            await getFCEResource<FCEQuestionnaire>({
                id: questionnaireId,
                resourceType: 'Questionnaire',
            }),
        );
        console.log('Conversion', questionnaire.id);
        const fhirQuestionnaire = ensure(
            await getFHIRResource<FHIRQuestionnaire>({ reference: `Questionnaire/${questionnaire.id}` }),
        );
        const fceQuestionnaire = toFirstClassExtension(fhirQuestionnaire);
        expect(fceQuestionnaire).toStrictEqual(questionnaire);
        const fhirQuestionnaireConverted = fromFirstClassExtension(fceQuestionnaire!);
        expect(sortExtensionsList(fhirQuestionnaireConverted)).toStrictEqual(sortExtensionsList(fhirQuestionnaire));
    });
});
