import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { aiService } from 'src/services/ai';

import { assistant, newSentence } from './bus';
import { RealtimeVoiceSession, startRealtimeVoice } from './connection';

type RecordingState = 'idle' | 'connecting' | 'recording' | 'paused' | 'processing';

interface AssistantSession {
    state: RecordingState;
    elapsedMs: number;
    levels: number[];
    start: () => Promise<void>;
    pause: () => void;
    resume: () => Promise<void>;
    stop: () => void;
}

const AssistantSessionContext = createContext<AssistantSession | null>(null);

const PROCESSING_TIMEOUT_MS = 4000;
const HISTORY_SIZE = 64;
const initialLevels = (): number[] => Array.from({ length: HISTORY_SIZE }, () => 0);

export function useAssistantSession(): AssistantSession {
    const ctx = useContext(AssistantSessionContext);
    if (!ctx) {
        throw new Error('useAssistantSession must be used inside <AssistantSessionProvider>');
    }
    return ctx;
}

export function AssistantSessionProvider({ children }: { children: ReactNode }) {
    const voiceRef = useRef<RealtimeVoiceSession>();
    const stateRef = useRef<RecordingState>('idle');
    const [state, setStateValue] = useState<RecordingState>('idle');
    const [elapsedMs, setElapsedMs] = useState(0);
    const [levels, setLevels] = useState<number[]>(initialLevels);

    const tickRef = useRef<number | null>(null);
    const tickStartRef = useRef<number>(0);
    const tickBaselineRef = useRef<number>(0);

    const unsubscribeEventsRef = useRef<(() => void) | null>(null);
    const unsubscribeLevelRef = useRef<(() => void) | null>(null);
    const processingTimeoutRef = useRef<number | null>(null);

    const setState = useCallback((next: RecordingState) => {
        stateRef.current = next;
        setStateValue(next);
    }, []);

    const stopTimer = useCallback(() => {
        if (tickRef.current !== null) {
            window.clearInterval(tickRef.current);
            tickRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        stopTimer();
        tickStartRef.current = Date.now();
        tickRef.current = window.setInterval(() => {
            setElapsedMs(tickBaselineRef.current + (Date.now() - tickStartRef.current));
        }, 1000);
    }, [stopTimer]);

    const freezeTimer = useCallback(() => {
        if (tickRef.current !== null) {
            tickBaselineRef.current += Date.now() - tickStartRef.current;
            stopTimer();
        }
    }, [stopTimer]);

    const resetTimer = useCallback(() => {
        stopTimer();
        tickBaselineRef.current = 0;
        tickStartRef.current = 0;
        setElapsedMs(0);
    }, [stopTimer]);

    const pushLevel = useCallback((next: number) => {
        setLevels((prev) => {
            const updated = prev.slice(1);
            updated.push(next);
            return updated;
        });
    }, []);

    const subscribeLevel = useCallback(() => {
        const session = voiceRef.current;
        if (!session) {
            return;
        }
        unsubscribeLevelRef.current?.();
        unsubscribeLevelRef.current = session.subscribeLevel(pushLevel);
    }, [pushLevel]);

    const unsubscribeLevel = useCallback(() => {
        unsubscribeLevelRef.current?.();
        unsubscribeLevelRef.current = null;
    }, []);

    const teardown = useCallback(() => {
        if (processingTimeoutRef.current !== null) {
            window.clearTimeout(processingTimeoutRef.current);
            processingTimeoutRef.current = null;
        }
        unsubscribeLevelRef.current?.();
        unsubscribeLevelRef.current = null;
        unsubscribeEventsRef.current?.();
        unsubscribeEventsRef.current = null;
        stopTimer();
        try {
            voiceRef.current?.stop();
        } catch (e) {
            console.error(e);
        }
        voiceRef.current = undefined;
        tickBaselineRef.current = 0;
        setElapsedMs(0);
        setLevels(initialLevels());
        setState('idle');
    }, [setState, stopTimer]);

    const start = useCallback(async () => {
        if (stateRef.current !== 'idle') {
            return;
        }
        setState('connecting');
        tickBaselineRef.current = 0;
        setElapsedMs(0);
        setLevels(initialLevels());

        let session: RealtimeVoiceSession;
        try {
            session = await startRealtimeVoice(aiService);
        } catch (e) {
            console.error('[Assistant] Failed to start realtime voice', e);
            setState('idle');
            return;
        }
        voiceRef.current = session;

        unsubscribeEventsRef.current = session.onEvent((evt: any) => {
            if (evt.type === 'session.updated' && stateRef.current === 'connecting') {
                setState('recording');
                startTimer();
                subscribeLevel();
            }
            if (evt.type === 'conversation.item.input_audio_transcription.completed') {
                assistant.dispatch(newSentence(evt.transcript));
                if (stateRef.current === 'processing') {
                    teardown();
                }
            }
        });

        session.clearAudioBuffer();
        await session.unmuteAudio();
    }, [setState, startTimer, subscribeLevel, teardown]);

    const pause = useCallback(() => {
        if (stateRef.current !== 'recording') {
            return;
        }
        voiceRef.current?.muteAudio();
        freezeTimer();
        unsubscribeLevel();
        setState('paused');
    }, [freezeTimer, setState, unsubscribeLevel]);

    const resume = useCallback(async () => {
        if (stateRef.current !== 'paused') {
            return;
        }
        await voiceRef.current?.unmuteAudio();
        setState('recording');
        startTimer();
        subscribeLevel();
    }, [setState, startTimer, subscribeLevel]);

    const stop = useCallback(() => {
        const current = stateRef.current;
        if (current !== 'recording' && current !== 'paused') {
            return;
        }
        freezeTimer();
        unsubscribeLevel();
        setState('processing');
        try {
            voiceRef.current?.muteAudio();
            voiceRef.current?.commitAudioBuffer();
        } catch (e) {
            console.error(e);
        }
        // Safety net: we move to `processing` and wait for one final
        // transcription.completed event before teardown. If the server never
        // emits it (dropped data channel, pure silence, transient error), the
        // UI would hang on the spinner with the WebRTC session still open.
        // Force-teardown after this delay so the user can always recover.
        processingTimeoutRef.current = window.setTimeout(() => {
            if (stateRef.current === 'processing') {
                teardown();
            }
        }, PROCESSING_TIMEOUT_MS);
    }, [freezeTimer, setState, teardown, unsubscribeLevel]);

    useEffect(() => {
        return () => {
            teardown();
        };
    }, [teardown]);

    useEffect(() => {
        if (state === 'idle') {
            resetTimer();
        }
    }, [resetTimer, state]);

    const value = useMemo<AssistantSession>(
        () => ({ state, elapsedMs, levels, start, pause, resume, stop }),
        [state, elapsedMs, levels, start, pause, resume, stop],
    );

    return <AssistantSessionContext.Provider value={value}>{children}</AssistantSessionContext.Provider>;
}
