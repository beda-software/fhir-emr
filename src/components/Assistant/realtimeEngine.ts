import { aiService } from 'src/services/ai';

import { startRealtimeVoice } from './connection';
import { AssistantEngineSession, createSignal } from './engine';

const PROCESSING_TIMEOUT_MS = 4000;

export async function createRealtimeEngine(): Promise<AssistantEngineSession> {
    const session = await startRealtimeVoice(aiService);

    const stateSignal = createSignal<'loading' | 'recording'>(true);
    const transcriptSignal = createSignal<string>();
    const errorSignal = createSignal<unknown>();

    let finalizing = false;
    let settled = false;
    let processingTimeout: number | null = null;
    let finalizePromise: Promise<void> | null = null;
    let finalizeResolve: (() => void) | null = null;

    const clearProcessingTimeout = () => {
        if (processingTimeout !== null) {
            window.clearTimeout(processingTimeout);
            processingTimeout = null;
        }
    };

    const unsubscribeEvents = session.onEvent((evt) => {
        if (evt.type === 'session.updated') {
            stateSignal.emit('recording');
        }
        if (evt.type === 'conversation.item.input_audio_transcription.completed') {
            if (settled) {
                return;
            }
            transcriptSignal.emit(typeof evt.transcript === 'string' ? evt.transcript : '');
            if (finalizing) {
                clearProcessingTimeout();
                settled = true;
                finalizeResolve?.();
            }
        }
    });

    session.clearAudioBuffer();
    await session.unmuteAudio();

    return {
        onStateChange: stateSignal.subscribe,
        onProgress: () => () => undefined,
        onTranscript: transcriptSignal.subscribe,
        onError: errorSignal.subscribe,
        subscribeLevel: session.subscribeLevel,
        pause: () => {
            session.muteAudio();
        },
        resume: () => session.unmuteAudio(),
        finalize: () => {
            if (finalizePromise) {
                return finalizePromise;
            }
            finalizing = true;
            finalizePromise = new Promise<void>((resolve) => {
                finalizeResolve = resolve;
            });
            try {
                session.muteAudio();
                session.commitAudioBuffer();
            } catch (e) {
                console.error(e);
            }
            // Safety net: wait for one final transcription.completed event. If the
            // server never emits it (dropped data channel, pure silence, transient
            // error) report an error so the session can recover instead of hanging.
            processingTimeout = window.setTimeout(() => {
                processingTimeout = null;
                if (!settled) {
                    settled = true;
                    errorSignal.emit(new Error('Realtime transcription timed out'));
                    finalizeResolve?.();
                }
            }, PROCESSING_TIMEOUT_MS);
            return finalizePromise;
        },
        stop: () => {
            settled = true;
            clearProcessingTimeout();
            unsubscribeEvents();
            try {
                session.stop();
            } catch (e) {
                console.error(e);
            }
        },
    };
}
