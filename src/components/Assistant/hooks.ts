import { useEffect, useRef, useState } from 'react';

import { aiService } from 'src/services/ai';

import { assistant, newSentence } from './bus';
import { RealtimeVoiceSession, startRealtimeVoice } from './connection';

type ConnectionStatus = 'notStarted' | 'connecting' | 'connected';

export function useVoice() {
    const voice = useRef<RealtimeVoiceSession>();
    const [connection, setConnection] = useState<ConnectionStatus>('notStarted');
    const [text, setText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    async function startRecording() {
        setConnection('connecting');
        voice.current = await startRealtimeVoice(aiService);
        function _handleEvent(evt: any) {
            if (evt.type == 'input_audio_buffer.speech_started') {
                setIsSpeaking(true);
            }
            if (evt.type == 'input_audio_buffer.speech_stopped') {
                setIsSpeaking(false);
            }
            if (evt.type === 'session.updated') {
                setConnection('connected');
            }
            if (evt.type == 'conversation.item.input_audio_transcription.delta') {
                setText((t) => t + evt.delta);
            }
            if (evt.type == 'debug') {
                console.log(evt);
            }
            if (evt.type === 'conversation.item.input_audio_transcription.completed') {
                assistant.dispatch(newSentence(evt.transcript));
            }
        }
        voice.current?.onEvent(_handleEvent);
        voice.current?.clearAudioBuffer();
        voice.current?.unmuteAudio();
    }

    function stopRecording() {
        setConnection('notStarted');
        voice.current?.stop();
        voice.current = undefined;
    }

    useEffect(() => {
        return () => stopRecording();
    }, []);

    return {
        connection,
        startRecording,
        stopRecording,
        text,
        isSpeaking,
    };
}
