import { isSuccess } from 'aidbox-react';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { service } from 'aidbox-react/lib/services/service';
import { ensure } from 'aidbox-react/lib/utils/tests';
import { OperationOutcome, Questionnaire } from 'shared/src/contrib/aidbox';
import { loginAdminUser } from 'src/setupTests';

describe('Validate all questionanires', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });
    test('All questionnaires are valid', async () => {
        const questionnaires = extractBundleResources(
            ensure(await getFHIRResources<Questionnaire>('Questionnaire', { _count: 9999 })),
        ).Questionnaire;
        for (let q of questionnaires) {
            console.log('validating', q.id);
            expect(q.meta?.profile?.length).toBe(1);
            expect(q.meta?.profile?.[0]).toBe('https://beda.software/beda-emr-questionnaire');
            const outcome = ensure(
                await service<OperationOutcome>({
                    url: '/Questionnaire/$validate',
                    data: q,
                    method: 'POST',
                }),
            );
            expect(outcome.resourceType).toBe('OperationOutcome');
            if (outcome.id !== 'allok') {
                console.log(JSON.stringify(outcome, undefined, 4));
            }
            expect(outcome.id).toBe('allok');
        }
    });
});
