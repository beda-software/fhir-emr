// eslint-disable-next-line
import { useAudioRecorder as useAudioRecorderControl } from 'react-audio-voice-recorder';

export interface RecorderControls {
    startRecording: () => void;
    stopRecording: () => void;
    togglePauseResume: () => void;
    recordingBlob?: Blob;
    isRecording: boolean;
    isPaused: boolean;
    recordingTime: number;
    mediaRecorder?: MediaRecorder;
}

export function useAudioRecorder() {
    const recorderControls: RecorderControls = useAudioRecorderControl();

    return { recorderControls };
}
