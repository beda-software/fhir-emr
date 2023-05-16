import { service } from 'fhir-react';

import config from 'shared/src/config';

export async function generateQuestionnaire(prompt: string, questionnaire?: string) {
    return await service<any>({
        baseURL: config.aiQuestionnaireBuilderUrl,
        url: `/questionnaire`,
        method: 'POST',
        data: { prompt: prompt, questionnaire },
    });
}
