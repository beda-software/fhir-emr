import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { service } from 'aidbox-react/lib/services/service';
import { ensure } from 'aidbox-react/lib/utils/tests';

import { Questionnaire as AidboxQuestionnaire } from 'shared/src/contrib/aidbox';

import { loginAdminUser } from 'src/setupTests';
import { toFirstClassExtension } from 'src/utils/fce';

const notWorkingQuestionnaires = ['edit-appointment', 'encounter-create-from-appointment', 'new-appointment'];

describe('Questionanire transformation', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });
    test('Each Questionnaires should convert to fce', async () => {
        const questionnaires = extractBundleResources(
            ensure(await getFHIRResources<AidboxQuestionnaire>('Questionnaire', { _count: 9999 })),
        ).Questionnaire;
        for (let q of questionnaires) {
            console.log('Conversion', q.id);
            if (!notWorkingQuestionnaires.includes(q.id)) {
                const fhirQuestionnaire = ensure(
                    await service<FHIRQuestionnaire>({
                        url: `/fhir/Questionnaire/${q.id}`,
                    }),
                );
                expect(toFirstClassExtension(fhirQuestionnaire)).toStrictEqual(q);
            }
        }
    });
});
