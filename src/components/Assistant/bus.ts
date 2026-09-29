import { createBus } from '@beda.software/fhir-react';

interface AssistantEvent {
    type: 'new-sentence';
    text: string;
}

export function newSentence(text: string): AssistantEvent {
    return {
        type: 'new-sentence',
        text,
    };
}

export const assistant = createBus<AssistantEvent>();
