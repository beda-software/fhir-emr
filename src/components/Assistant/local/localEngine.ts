import { AssistantEngineSession, createSignal } from '../engine';
import { createLevelMeter } from '../levelMeter';

const TARGET_SAMPLE_RATE = 16000;
const SPEECH_LEVEL_THRESHOLD = 0.12;
const SILENCE_HOLD_MS = 800;
const MIN_SEGMENT_MS = 700;
// Safety net: if the worker never returns results for submitted segments, resolve
// finalize() anyway so the UI can't hang in 'processing'.
const FINALIZE_TIMEOUT_MS = 20000;

type WorkerInbound = { type: 'load' } | { type: 'process'; id: number; audio: Float32Array };

type WorkerOutbound =
    | { type: 'progress'; fraction: number }
    | { type: 'ready' }
    | { type: 'result'; id: number; text: string }
    | { type: 'error'; id?: number; message: string };

let sharedWorker: Worker | null = null;
let modelsLoaded = false;
let sessionCounter = 0;

function getWorker(): Worker {
    if (!sharedWorker) {
        sharedWorker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    }
    return sharedWorker;
}

function pickMimeType(): string | undefined {
    if (typeof MediaRecorder === 'undefined') {
        return undefined;
    }
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

async function decodeToPCM(blob: Blob): Promise<Float32Array> {
    const arrayBuffer = await blob.arrayBuffer();
    const decodeCtxCtor = window.AudioContext ?? (window as any).webkitAudioContext;
    const decodeCtx: AudioContext = new decodeCtxCtor();
    let decoded: AudioBuffer;
    try {
        decoded = await decodeCtx.decodeAudioData(arrayBuffer);
    } finally {
        decodeCtx.close().catch(() => undefined);
    }
    const frameCount = Math.max(1, Math.ceil(decoded.duration * TARGET_SAMPLE_RATE));
    const offline = new OfflineAudioContext(1, frameCount, TARGET_SAMPLE_RATE);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    return rendered.getChannelData(0).slice();
}

export async function createLocalEngine(): Promise<AssistantEngineSession> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone capture is not available in this browser');
    }

    const stateSignal = createSignal<'loading' | 'recording'>(true);
    const progressSignal = createSignal<number>(true);
    const transcriptSignal = createSignal<string>();
    const errorSignal = createSignal<unknown>();
    const levelMeter = createLevelMeter();

    const sessionId = ++sessionCounter;
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
    });
    const worker = getWorker();
    const mimeType = pickMimeType();

    let recorder: MediaRecorder | null = null;
    let chunks: Blob[] = [];
    let ready = false;
    let stopped = false;

    let finalizing = false;
    let finalizePromise: Promise<void> | null = null;
    let finalizeResolve: (() => void) | null = null;
    let finalizeTimeout: number | null = null;
    let finalSegmentInitiated = false;
    let outstanding = 0;

    let speechSeen = false;
    let silenceSince = 0;
    let segmentStart = 0;
    let vadUnsub: (() => void) | null = null;

    const releaseStream = () => {
        stream.getTracks().forEach((track) => track.stop());
    };

    const clearFinalizeTimeout = () => {
        if (finalizeTimeout !== null) {
            window.clearTimeout(finalizeTimeout);
            finalizeTimeout = null;
        }
    };

    const checkFinalizeDone = () => {
        if (finalizing && finalSegmentInitiated && outstanding === 0) {
            clearFinalizeTimeout();
            finalizeResolve?.();
            finalizeResolve = null;
        }
    };

    const startSegment = () => {
        if (stopped) {
            return;
        }
        const segmentChunks: Blob[] = [];
        chunks = segmentChunks;
        const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        rec.ondataavailable = (event) => {
            if (event.data.size > 0) {
                segmentChunks.push(event.data);
            }
        };
        rec.start();
        recorder = rec;
        segmentStart = Date.now();
    };

    const flushSegment = (isFinal: boolean) => {
        const rec = recorder;
        const segmentChunks = chunks;
        recorder = null;
        chunks = [];
        if (!rec || rec.state === 'inactive') {
            if (!isFinal) {
                startSegment();
            }
            return;
        }
        outstanding += 1;
        rec.onstop = () => {
            const blob = new Blob(segmentChunks, { type: rec.mimeType || 'audio/webm' });
            if (blob.size === 0) {
                outstanding -= 1;
                checkFinalizeDone();
                return;
            }
            decodeToPCM(blob)
                .then((audio) => {
                    const processMessage: WorkerInbound = { type: 'process', id: sessionId, audio };
                    worker.postMessage(processMessage, [audio.buffer as ArrayBuffer]);
                })
                .catch((e) => {
                    console.error('[Assistant] Segment decode failed', e);
                    outstanding -= 1;
                    checkFinalizeDone();
                });
        };
        if (!isFinal) {
            startSegment();
        }
        rec.stop();
    };

    const resetVad = () => {
        speechSeen = false;
        silenceSince = 0;
        segmentStart = Date.now();
    };

    const onVadLevel = (level: number) => {
        if (finalizing || stopped) {
            return;
        }
        const now = Date.now();
        if (level >= SPEECH_LEVEL_THRESHOLD) {
            speechSeen = true;
            silenceSince = 0;
            return;
        }
        if (!speechSeen) {
            return;
        }
        if (silenceSince === 0) {
            silenceSince = now;
            return;
        }
        if (now - silenceSince >= SILENCE_HOLD_MS && now - segmentStart >= MIN_SEGMENT_MS) {
            speechSeen = false;
            silenceSince = 0;
            flushSegment(false);
        }
    };

    const startVad = () => {
        if (vadUnsub) {
            return;
        }
        resetVad();
        vadUnsub = levelMeter.subscribeLevel(onVadLevel);
    };

    const stopVad = () => {
        vadUnsub?.();
        vadUnsub = null;
    };

    const onWorkerMessage = (event: MessageEvent) => {
        const message = event.data as WorkerOutbound;
        if (message.type === 'progress') {
            progressSignal.emit(message.fraction);
            return;
        }
        if (message.type === 'ready') {
            if (stopped || ready) {
                return;
            }
            ready = true;
            modelsLoaded = true;
            startSegment();
            levelMeter.attachStream(stream);
            startVad();
            stateSignal.emit('recording');
            return;
        }
        if (message.type === 'result') {
            if (message.id !== sessionId) {
                return;
            }
            outstanding -= 1;
            transcriptSignal.emit(message.text);
            checkFinalizeDone();
            return;
        }
        if (message.type === 'error') {
            if (message.id === undefined) {
                // No id -> a load failure, not a segment: fatal, nothing can transcribe.
                errorSignal.emit(new Error(message.message));
                return;
            }
            if (message.id !== sessionId) {
                return;
            }
            console.error('[Assistant] Segment transcription failed:', message.message);
            outstanding -= 1;
            checkFinalizeDone();
        }
    };

    const onWorkerError = (event: ErrorEvent) => {
        errorSignal.emit(event.error ?? new Error('Assistant worker failed'));
    };

    worker.addEventListener('message', onWorkerMessage);
    worker.addEventListener('error', onWorkerError);

    if (!modelsLoaded) {
        stateSignal.emit('loading');
    }
    const loadMessage: WorkerInbound = { type: 'load' };
    worker.postMessage(loadMessage);

    return {
        onStateChange: stateSignal.subscribe,
        onProgress: progressSignal.subscribe,
        onTranscript: transcriptSignal.subscribe,
        onError: errorSignal.subscribe,
        subscribeLevel: levelMeter.subscribeLevel,
        pause: () => {
            stopVad();
            if (recorder && recorder.state === 'recording') {
                recorder.pause();
            }
            levelMeter.detach();
        },
        resume: async () => {
            if (recorder && recorder.state === 'paused') {
                recorder.resume();
            }
            levelMeter.attachStream(stream);
            startVad();
        },
        finalize: () => {
            if (finalizing) {
                return finalizePromise ?? Promise.resolve();
            }
            finalizing = true;
            stopVad();
            levelMeter.detach();
            finalizePromise = new Promise<void>((resolve) => {
                finalizeResolve = resolve;
            });
            if (ready) {
                flushSegment(true);
            }
            finalSegmentInitiated = true;
            finalizeTimeout = window.setTimeout(() => {
                finalizeTimeout = null;
                if (finalizeResolve) {
                    errorSignal.emit(new Error('Local transcription timed out'));
                    finalizeResolve();
                    finalizeResolve = null;
                }
            }, FINALIZE_TIMEOUT_MS);
            checkFinalizeDone();
            return finalizePromise;
        },
        stop: () => {
            stopped = true;
            clearFinalizeTimeout();
            stopVad();
            levelMeter.stop();
            try {
                if (recorder && recorder.state !== 'inactive') {
                    recorder.stop();
                }
            } catch (e) {
                console.error(e);
            }
            recorder = null;
            worker.removeEventListener('message', onWorkerMessage);
            worker.removeEventListener('error', onWorkerError);
            releaseStream();
        },
    };
}
