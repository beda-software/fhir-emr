import { readdirSync } from 'fs';
import { parse as parsePath } from 'path';

import { OperationOutcome, Questionnaire } from 'fhir/r4b';

import { ensure } from '@beda.software/fhir-react';

import { getFHIRResource, service } from 'src/services/fhir';
import { loginAdminUser } from 'src/setupTests';

describe('Validate all questionnaires', () => {
    beforeEach(async () => {
        await loginAdminUser();
    });

    const filenames = readdirSync('resources/seeds/Questionnaire').map((filename) => parsePath(filename).name);

    test.each(filenames)('Questionnaire %s is valid', async (questionnaireId) => {
        const questionnaire = ensure(
            await getFHIRResource<Questionnaire>({ reference: `Questionnaire/${questionnaireId}` }),
        );
        expect(questionnaire.meta?.profile?.length).toBeGreaterThanOrEqual(1);
        const bedaQuestionnaireProfile = questionnaire.meta?.profile?.find(
            (profileUrl) => profileUrl === 'https://beda.software/beda-emr-questionnaire',
        );
        expect(bedaQuestionnaireProfile).not.toBeUndefined();
        const outcome = ensure(
            await service<OperationOutcome>({
                url: '/Questionnaire/$validate',
                data: questionnaire,
                method: 'POST',
            }),
        );
        expect(outcome.resourceType).toBe('OperationOutcome');
        if (outcome.id !== 'allok') {
            console.log('qid', questionnaireId);
            console.log(JSON.stringify(outcome, undefined, 4));
        }
        expect(outcome.id).toBe('allok');
    });
});
