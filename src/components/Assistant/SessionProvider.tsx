import { t } from '@lingui/macro';
import { notification } from 'antd';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import config from '@beda.software/emr-config';

import { assistant, newSentence } from './bus';
import { AssistantEngineSession } from './engine';
import { createRealtimeEngine } from './realtimeEngine';

type RecordingState = 'idle' | 'connecting' | 'loading' | 'recording' | 'paused' | 'processing';

interface AssistantSession {
    state: RecordingState;
    elapsedMs: number;
    levels: number[];
    loadProgress: number;
    start: () => Promise<void>;
    pause: () => void;
    resume: () => Promise<void>;
    stop: () => void;
}

const AssistantSessionContext = createContext<AssistantSession | null>(null);

const HISTORY_SIZE = 64;
const initialLevels = (): number[] => Array.from({ length: HISTORY_SIZE }, () => 0);

async function createEngine(): Promise<AssistantEngineSession> {
    if (config.localAiAssistant) {
        const { createLocalEngine } = await import('./local/localEngine');
        return createLocalEngine();
    }
    return createRealtimeEngine();
}

export function useAssistantSession(): AssistantSession {
    const ctx = useContext(AssistantSessionContext);
    if (!ctx) {
        throw new Error('useAssistantSession must be used inside <AssistantSessionProvider>');
    }
    return ctx;
}

export function AssistantSessionProvider({ children }: { children: ReactNode }) {
    const engineRef = useRef<AssistantEngineSession>();
    const stateRef = useRef<RecordingState>('idle');
    const cancelledRef = useRef(false);
    const [state, setStateValue] = useState<RecordingState>('idle');
    const [elapsedMs, setElapsedMs] = useState(0);
    const [levels, setLevels] = useState<number[]>(initialLevels);
    const [loadProgress, setLoadProgress] = useState(0);

    const tickRef = useRef<number | null>(null);
    const tickStartRef = useRef<number>(0);
    const tickBaselineRef = useRef<number>(0);

    const unsubscribersRef = useRef<Array<() => void>>([]);
    const unsubscribeLevelRef = useRef<(() => void) | null>(null);

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
        const engine = engineRef.current;
        if (!engine) {
            return;
        }
        unsubscribeLevelRef.current?.();
        unsubscribeLevelRef.current = engine.subscribeLevel(pushLevel);
    }, [pushLevel]);

    const unsubscribeLevel = useCallback(() => {
        unsubscribeLevelRef.current?.();
        unsubscribeLevelRef.current = null;
    }, []);

    const teardown = useCallback(() => {
        unsubscribersRef.current.forEach((unsubscribe) => unsubscribe());
        unsubscribersRef.current = [];
        unsubscribeLevelRef.current?.();
        unsubscribeLevelRef.current = null;
        stopTimer();
        try {
            engineRef.current?.stop();
        } catch (e) {
            console.error(e);
        }
        engineRef.current = undefined;
        tickBaselineRef.current = 0;
        setElapsedMs(0);
        setLevels(initialLevels());
        setLoadProgress(0);
        setState('idle');
    }, [setState, stopTimer]);

    const start = useCallback(async () => {
        if (stateRef.current !== 'idle') {
            return;
        }
        setState('connecting');
        cancelledRef.current = false;
        tickBaselineRef.current = 0;
        setElapsedMs(0);
        setLevels(initialLevels());
        setLoadProgress(0);

        let engine: AssistantEngineSession;
        try {
            engine = await createEngine();
        } catch (e) {
            console.error('[Assistant] Failed to start engine', e);
            notification.error({ message: t`Failed to start the assistant` });
            setState('idle');
            return;
        }

        if (cancelledRef.current) {
            try {
                engine.stop();
            } catch (e) {
                console.error(e);
            }
            setState('idle');
            return;
        }

        engineRef.current = engine;

        unsubscribersRef.current.push(
            engine.onStateChange((phase) => {
                if (phase === 'loading' && stateRef.current === 'connecting') {
                    setState('loading');
                }
                if (phase === 'recording' && (stateRef.current === 'connecting' || stateRef.current === 'loading')) {
                    setState('recording');
                    startTimer();
                    subscribeLevel();
                }
            }),
            engine.onProgress((fraction) => {
                setLoadProgress(fraction);
            }),
            engine.onTranscript((text) => {
                const trimmed = text.trim();
                if (trimmed) {
                    assistant.dispatch(newSentence(trimmed));
                }
            }),
            engine.onError((error) => {
                console.error('[Assistant] Engine error', error);
                if (stateRef.current !== 'processing') {
                    notification.error({ message: t`Assistant error` });
                }
                teardown();
            }),
        );
    }, [setState, startTimer, subscribeLevel, teardown]);

    const pause = useCallback(() => {
        if (stateRef.current !== 'recording') {
            return;
        }
        engineRef.current?.pause();
        freezeTimer();
        unsubscribeLevel();
        setState('paused');
    }, [freezeTimer, setState, unsubscribeLevel]);

    const resume = useCallback(async () => {
        if (stateRef.current !== 'paused') {
            return;
        }
        try {
            await engineRef.current?.resume();
        } catch (e) {
            console.error('[Assistant] Failed to resume', e);
            notification.error({ message: t`Assistant error` });
            teardown();
            return;
        }
        setState('recording');
        startTimer();
        subscribeLevel();
    }, [setState, startTimer, subscribeLevel, teardown]);

    const stop = useCallback(() => {
        const current = stateRef.current;
        if (current === 'connecting') {
            cancelledRef.current = true;
            if (engineRef.current) {
                teardown();
            }
            return;
        }
        if (current === 'loading') {
            teardown();
            return;
        }
        if (current !== 'recording' && current !== 'paused') {
            return;
        }
        freezeTimer();
        unsubscribeLevel();
        setState('processing');
        const engine = engineRef.current;
        if (!engine) {
            teardown();
            return;
        }
        engine.finalize().finally(() => {
            if (stateRef.current === 'processing') {
                teardown();
            }
        });
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
        () => ({ state, elapsedMs, levels, loadProgress, start, pause, resume, stop }),
        [state, elapsedMs, levels, loadProgress, start, pause, resume, stop],
    );

    return <AssistantSessionContext.Provider value={value}>{children}</AssistantSessionContext.Provider>;
}
