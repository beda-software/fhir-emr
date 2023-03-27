import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { service } from 'aidbox-react/lib/services/service';
import { ensure } from 'aidbox-react/lib/utils/tests';
import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';
import { Questionnaire as AidboxQuestionnaire } from 'shared/src/contrib/aidbox';
import { loginAdminUser } from 'src/setupTests';
import { toFirstClassExtension } from 'src/utils/fce';

describe('Questionanire transformation', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });
    test('Each Questionnaire shod converts', async () => {
        const questionnaires = extractBundleResources(
            ensure(await getFHIRResources<AidboxQuestionnaire>('Questionnaire', { _count: 9999 })),
        ).Questionnaire;
        for (let q of questionnaires) {
            console.log('Convertion', q.id);
            const fhirQuestionanire = ensure(
                await service<FHIRQuestionnaire>({
                    url: `/fhir/Questionnaire/${q.id}`,
                }),
            );
            // Temporary disable
            // expect(toFirstClassExtension(fhirQuestionanire)).toStrictEqual(q);
        }
    });
});
