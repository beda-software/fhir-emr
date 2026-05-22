import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
if (env.backends?.onnx?.wasm) {
    // ORT 1.26 ships several wasm variants (jsep / jspi / asyncify / plain); point at the
    // directory so ORT's loader picks the one matching the backend instead of forcing one.
    env.backends.onnx.wasm.wasmPaths = '/ort/';
}

const ASR_MODEL_WASM = 'onnx-community/whisper-tiny.en';
const ASR_MODEL_WEBGPU = 'onnx-community/whisper-base.en';

type WorkerInbound = { type: 'load' } | { type: 'process'; id: number; audio: Float32Array };

type WorkerOutbound =
    | { type: 'progress'; fraction: number }
    | { type: 'ready' }
    | { type: 'result'; id: number; text: string }
    | { type: 'error'; id?: number; message: string };

let asr: any = null;
let loadPromise: Promise<void> | null = null;
let processQueue: Promise<void> = Promise.resolve();

const fileProgress = new Map<string, number>();

function post(message: WorkerOutbound) {
    self.postMessage(message);
}

function handleProgress(info: any) {
    if (info && typeof info.file === 'string') {
        if (info.status === 'progress' && typeof info.progress === 'number') {
            fileProgress.set(info.file, info.progress);
        } else if (info.status === 'done') {
            fileProgress.set(info.file, 100);
        } else if (info.status === 'initiate') {
            fileProgress.set(info.file, fileProgress.get(info.file) ?? 0);
        }
    }
    if (fileProgress.size > 0) {
        let sum = 0;
        fileProgress.forEach((value) => {
            sum += value;
        });
        post({ type: 'progress', fraction: sum / fileProgress.size / 100 });
    }
}

async function load() {
    if (asr) {
        return;
    }
    if (!loadPromise) {
        loadPromise = (async () => {
            fileProgress.clear();
            const webgpu = typeof navigator !== 'undefined' && 'gpu' in navigator;
            asr = await pipeline('automatic-speech-recognition', webgpu ? ASR_MODEL_WEBGPU : ASR_MODEL_WASM, {
                device: webgpu ? 'webgpu' : 'wasm',
                dtype: 'fp32',
                progress_callback: handleProgress,
            });
        })();
    }
    await loadPromise;
}

async function transcribe(audio: Float32Array): Promise<string> {
    const output: any = await asr(audio, { chunk_length_s: 30, stride_length_s: 5 });
    const text = Array.isArray(output) ? output.map((part: any) => part?.text ?? '').join(' ') : output?.text;
    if (typeof text !== 'string') {
        return '';
    }
    // Whisper emits non-speech annotations like [BLANK_AUDIO] or (coughing) — drop them.
    return text
        .replace(/\[[^\]]*\]|\([^)]*\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

async function handleMessage(message: WorkerInbound) {
    if (message.type === 'load') {
        try {
            await load();
            post({ type: 'ready' });
        } catch (e) {
            loadPromise = null;
            post({ type: 'error', message: e instanceof Error ? e.message : String(e) });
        }
        return;
    }
    if (message.type === 'process') {
        const { id, audio } = message;
        processQueue = processQueue.then(async () => {
            try {
                const transcript = await transcribe(audio);
                post({ type: 'result', id, text: transcript });
            } catch (e) {
                post({ type: 'error', id, message: e instanceof Error ? e.message : String(e) });
            }
        });
    }
}

self.addEventListener('message', (event: MessageEvent) => {
    void handleMessage(event.data as WorkerInbound);
});
