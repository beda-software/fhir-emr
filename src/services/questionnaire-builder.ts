import { Questionnaire } from 'fhir/r4b';

import config from '@beda.software/emr-config';

import { getToken } from './auth';
import { service } from './fhir';

export async function generateQuestionnaire(prompt: string, questionnaire?: string) {
    const appToken = getToken();

    return await service<Questionnaire>({
        baseURL: config.aiQuestionnaireBuilderUrl,
        url: `/questionnaire`,
        method: 'POST',
        data: { prompt: prompt, questionnaire },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}

export async function generateQuestionnaireFromFile(file: File, questionnaire?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (questionnaire) {
        formData.append('questionnaire', questionnaire);
    }
    const appToken = getToken();

    return await service<{ questionnaire: Questionnaire; markdown: string }>({
        baseURL: config.aiQuestionnaireBuilderUrl,
        url: `/questionnaire-from-file`,
        method: 'POST',
        data: formData,
        headers: {
            Authorization: `Bearer ${appToken}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}
