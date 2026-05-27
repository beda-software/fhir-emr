const NOIZE_LEVEL_SAMPLE_INTERVAL_MS = 80;
const NOIZE_LEVEL_FFT_SIZE = 1024;
const NOIZE_LEVEL_GAIN = 5;

export interface LevelMeter {
    attachStream: (stream: MediaStream) => void;
    detach: () => void;
    subscribeLevel: (handler: (level: number) => void) => () => void;
    stop: () => void;
}

export function createLevelMeter(): LevelMeter {
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let analyserSource: MediaStreamAudioSourceNode | null = null;
    let analyserInterval: number | null = null;
    const levelHandlers = new Set<(level: number) => void>();
    const analyserBuffer = new Uint8Array(NOIZE_LEVEL_FFT_SIZE);

    const startAnalyserLoop = () => {
        if (!analyser || analyserInterval !== null) {
            return;
        }
        analyserInterval = window.setInterval(() => {
            if (!analyser) {
                return;
            }
            analyser.getByteTimeDomainData(analyserBuffer);
            // Raw PCM samples come back as Uint8 centered at 128 (silence).
            // (s - 128) / 128 re-centers and normalises to -1..1; |…| folds
            // negative swings up so we can compare both half-cycles. Tracking
            // the max absolute value over the window gives the peak amplitude
            // for this 80 ms slice — more responsive than RMS because browser
            // AGC squashes the mean toward zero but leaves voiced syllables
            // spiking. Gain + clamp then maps it into the 0..1 range the UI
            // consumes.
            let peak = 0;
            for (let i = 0; i < analyserBuffer.length; i++) {
                const magnitude = Math.abs(analyserBuffer[i]! - 128) / 128;
                if (magnitude > peak) {
                    peak = magnitude;
                }
            }
            const level = Math.min(1, peak * NOIZE_LEVEL_GAIN);
            levelHandlers.forEach((cb) => cb(level));
        }, NOIZE_LEVEL_SAMPLE_INTERVAL_MS);
    };

    const stopAnalyserLoop = () => {
        if (analyserInterval !== null) {
            window.clearInterval(analyserInterval);
            analyserInterval = null;
        }
        if (analyserSource) {
            try {
                analyserSource.disconnect();
            } catch (e) {
                console.error(e);
            }
            analyserSource = null;
        }
        if (levelHandlers.size > 0) {
            levelHandlers.forEach((cb) => cb(0));
        }
    };

    const attachStream = (stream: MediaStream) => {
        if (!audioCtx) {
            const audioCtxCtor = window.AudioContext ?? (window as any).webkitAudioContext;
            if (!audioCtxCtor) {
                return;
            }
            audioCtx = new audioCtxCtor();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = NOIZE_LEVEL_FFT_SIZE;
            analyser.smoothingTimeConstant = 0.7;
        }
        if (!audioCtx || !analyser) {
            return;
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => undefined);
        }
        if (analyserSource) {
            try {
                analyserSource.disconnect();
            } catch (e) {
                console.error(e);
            }
        }
        analyserSource = audioCtx.createMediaStreamSource(stream);
        analyserSource.connect(analyser);
        if (analyserInterval === null && levelHandlers.size > 0) {
            startAnalyserLoop();
        }
    };

    const subscribeLevel = (handler: (level: number) => void) => {
        levelHandlers.add(handler);
        if (analyserSource && analyserInterval === null) {
            startAnalyserLoop();
        }
        return () => {
            levelHandlers.delete(handler);
            if (levelHandlers.size === 0 && analyserInterval !== null) {
                window.clearInterval(analyserInterval);
                analyserInterval = null;
            }
        };
    };

    const stop = () => {
        stopAnalyserLoop();
        levelHandlers.clear();
        if (audioCtx) {
            audioCtx.close().catch(() => undefined);
            audioCtx = null;
            analyser = null;
        }
    };

    return { attachStream, detach: stopAnalyserLoop, subscribeLevel, stop };
}
