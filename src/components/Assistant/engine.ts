export type EnginePhase = 'loading' | 'recording';

export interface AssistantEngineSession {
    onStateChange: (cb: (phase: EnginePhase) => void) => () => void;
    onProgress: (cb: (fraction: number) => void) => () => void;
    onTranscript: (cb: (text: string) => void) => () => void;
    onError: (cb: (error: unknown) => void) => () => void;
    subscribeLevel: (cb: (level: number) => void) => () => void;
    pause: () => void;
    resume: () => Promise<void>;
    finalize: () => Promise<void>;
    stop: () => void;
}

export interface Signal<T> {
    emit: (value: T) => void;
    subscribe: (cb: (value: T) => void) => () => void;
}

export function createSignal<T>(replayLast = false): Signal<T> {
    const handlers = new Set<(value: T) => void>();
    let last: { value: T } | null = null;

    return {
        emit(value) {
            last = { value };
            handlers.forEach((handler) => {
                try {
                    handler(value);
                } catch (e) {
                    console.error('[Assistant] engine signal handler failed', e);
                }
            });
        },
        subscribe(cb) {
            handlers.add(cb);
            if (replayLast && last) {
                cb(last.value);
            }
            return () => {
                handlers.delete(cb);
            };
        },
    };
}
