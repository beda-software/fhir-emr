import { Questionnaire } from 'fhir/r4b';

import { aiService } from './ai';

export async function generateQuestionnaire(prompt: string, questionnaire?: string) {
    return await aiService<Questionnaire>({
        url: `/questionnaire`,
        method: 'POST',
        data: { prompt: prompt, questionnaire },
    });
}

export async function generateQuestionnaireFromFile(file: File, questionnaire?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (questionnaire) {
        formData.append('questionnaire', questionnaire);
    }

    return await aiService<{ questionnaire: Questionnaire; markdown: string }>({
        url: `/questionnaire-from-file`,
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
