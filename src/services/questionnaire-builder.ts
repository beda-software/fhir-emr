import { Questionnaire } from 'fhir/r4b';

import { aiService } from './ai';
import { getToken } from './auth';

export async function generateQuestionnaire(prompt: string, questionnaire?: string) {
    const appToken = getToken();

    return await aiService<Questionnaire>({
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

    return await aiService<{ questionnaire: Questionnaire; markdown: string }>({
        url: `/questionnaire-from-file`,
        method: 'POST',
        data: formData,
        headers: {
            Authorization: `Bearer ${appToken}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}
