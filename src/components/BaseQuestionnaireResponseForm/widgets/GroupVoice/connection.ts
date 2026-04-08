import { initServices } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

function ensureWebRTCAvailable() {
    if (typeof navigator.mediaDevices === 'undefined'

        ||
        typeof window.RTCPeerConnection === 'undefined') {
        const msg = `WebRTC is not available.
Your browser does not support WebRTC. Use a modern browser (Chrome, Firefox, Safari, Edge).`;
        throw new Error(msg);
    }
}

type RealtimeEvent = { type?: string;[k: string]: any };

export type RealtimeVoiceSession = {
    pc: RTCPeerConnection;
    stop: () => void;
    onEvent: (handler: (evt: RealtimeEvent) => void) => () => void;
    commitAudioBuffer: () => void;
    clearAudioBuffer: () => void;
    muteAudio: () => void;
    unmuteAudio: () => Promise<void>;
};


export async function startRealtimeVoice(service: Awaited<ReturnType<typeof initServices>['service']>,
): Promise<RealtimeVoiceSession> {
    // 0) Guard and basic event bus
    ensureWebRTCAvailable();
    const eventHandlers = new Set<(evt: RealtimeEvent) => void>();

    const emit = (evt: RealtimeEvent) => {
        try {
            eventHandlers.forEach((h) => h(evt));
        } catch (e) {
            console.error('[VoiceAssistant] Error in event handler:', e);
        }
    };

    // 1) Get ephemeral token from your server
    const response = await service<{ client_secret: { value: string } }>({
        method: 'POST',
        url: 'real-time-session',
        data: { model: 'gpt-4o-realtime-preview', voice: 'verse', modalities: ['audio', 'text'] },
    });

    if (!isSuccess(response)) {
        throw new Error(`Ephemeral token fetch failed: ${JSON.stringify(response)}`);
    }

    const { client_secret } = response.data;
    if (!client_secret?.value) throw new Error('Ephemeral token response missing client_secret.value');

    // 2) Create PeerConnection
    const pc = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] }],
    });

    // Set up debug signals EARLY to catch all state changes
    pc.oniceconnectionstatechange = () => {
        emit({ type: 'pc.iceState', state: pc.iceConnectionState });
    };
    pc.onconnectionstatechange = () => {
        emit({ type: 'pc.connState', state: pc.connectionState });
    };
    pc.onsignalingstatechange = () => {
        emit({ type: 'pc.signalingState', state: pc.signalingState });
    };
    pc.onicegatheringstatechange = () => {
        emit({ type: 'pc.gatherState', state: pc.iceGatheringState });
    };
    pc.onicecandidate = (ev: any) => {
        if (!ev?.candidate) {
            emit({ type: 'pc.iceCandidateComplete' });
        } else {
            emit({ type: 'pc.iceCandidate', candidate: ev.candidate.candidate, sdpMid: ev.candidate.sdpMid });
        }
    };

    // 3) Create client data channel BEFORE the offer
    let eventsChannel: any = null;
    eventsChannel = pc.createDataChannel('oai-events', {
        ordered: true,
    });
    const handleMessage = (data: any) => {
        try {
            const evt = typeof data === 'string' ? JSON.parse(data) : data;
            emit(evt);

            // Log important events for debugging
            if (evt.type === 'session.updated') {
                emit({ type: 'debug', message: 'Session configured successfully' });
            } else if (evt.type === 'error') {
                emit({ type: 'debug', message: `Error from API: ${JSON.stringify(evt)}` });
            } else if (evt.type === 'conversation.item.input_audio_transcription.completed') {
                emit({ type: 'debug', message: `Transcription: ${evt.transcript}` });
            } else if (evt.type === 'response.audio_transcript.delta') {
                emit({ type: 'debug', message: `AI response: ${evt.delta}` });
            }
        } catch (e) {
            emit({ type: 'parse.error', raw: data, error: String(e) });
        }
    };
    eventsChannel.onopen = () => {
        emit({ type: 'events.open' });
        try {
            const sessionConfig = {
                type: 'session.update',
                session: {
                    modalities: ['text'],
                    input_audio_format: 'pcm16',
                    input_audio_transcription: {
                        model: 'whisper-1',
                        language: 'en',
                    },
                    turn_detection: { type: 'server_vad', silence_duration_ms: 800 },
                },
            };
            eventsChannel.send(JSON.stringify(sessionConfig));
            emit({ type: 'session.update.sent' });
        } catch (e) {
            console.error('[VoiceAssistant] Error sending session.update:', e);
            emit({ type: 'session.update.error', error: String(e) });
        }
    };
    eventsChannel.onmessage = (ev: any) => {
        handleMessage(ev.data);
    };
    eventsChannel.onclose = () => {
        emit({ type: 'events.close' });
    };
    eventsChannel.onerror = (err: any) => {
        console.error('[VoiceAssistant] Data channel error:', err);
        emit({ type: 'events.error', error: String(err) });
    };

    // Also listen if the server opens its own channel
    pc.ondatachannel = (e: any) => {
        const ch = e.channel;
        if (ch?.label === 'oai-events' && ch !== eventsChannel) {
            ch.onmessage = (msg: any) => handleMessage(msg.data);
            ch.onopen = () => emit({ type: 'events.open.server' });
            ch.onclose = () => emit({ type: 'events.close.server' });
            ch.onerror = (err: any) => emit({ type: 'events.error.server', error: String(err) });
        }
    };

    // 4) Set up audio transceiver — mic is acquired lazily on first recording
    const audioTransceiver = pc.addTransceiver('audio', { direction: 'sendrecv' });
    const audioSender = audioTransceiver.sender;
    let localStream: MediaStream | null = null;
    let localTrack: MediaStreamTrack | null = null;

    pc.ontrack = (ev: any) => {
        emit({ type: 'pc.remoteTrack', kind: ev?.track?.kind });
    };

    // 5) Offer/Answer
    const offer = await pc.createOffer({ offerToReceiveAudio: true });
    await pc.setLocalDescription(offer);
    await new Promise<void>((resolve) => {
        if (pc.iceGatheringState === 'complete') return resolve();
        const check = () => {
            if (pc.iceGatheringState === 'complete') {
                pc.removeEventListener('icegatheringstatechange', check);
                resolve();
            }
        };
        pc.addEventListener('icegatheringstatechange', check);
        setTimeout(() => resolve(), 2500);
    });
    const resp = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${client_secret.value}`,
            'Content-Type': 'application/sdp',
        },
        body: offer.sdp!,
    });
    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('[VoiceAssistant] OpenAI error response:', text);
        throw new Error(`Realtime SDP exchange failed: ${resp.status} ${resp.statusText} ${text}`);
    }
    const answerSDP = await resp.text();
    await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP });

    // 7) Stop + subscriptions
    const stop = () => {
        try {
            if (localStream) {
                localStream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
            }
        } catch {}
        try {
            eventsChannel?.close?.();
        } catch {}
        try {
            pc.close();
        } catch {}
    };
    const onEvent = (handler: (evt: RealtimeEvent) => void) => {
        eventHandlers.add(handler);
        return () => {
            eventHandlers.delete(handler);
        };
    };
    const commitAudioBuffer = () => {
        if (!eventsChannel || eventsChannel.readyState !== 'open') {
            console.warn('[VoiceAssistant] Cannot commit audio: data channel not open');
            return;
        }
        try {
            // Commit the audio buffer for transcription (no response creation)
            const commitEvent = {
                type: 'input_audio_buffer.commit',
            };
            eventsChannel.send(JSON.stringify(commitEvent));
        } catch (e) {
            console.error('[VoiceAssistant] Error committing audio buffer:', e);
        }
    };
    const clearAudioBuffer = () => {
        if (!eventsChannel || eventsChannel.readyState !== 'open') {
            console.warn('[VoiceAssistant] Cannot clear audio buffer: data channel not open');
            return;
        }
        try {
            eventsChannel.send(JSON.stringify({ type: 'input_audio_buffer.clear' }));
        } catch (e) {
            console.error('[VoiceAssistant] Error clearing audio buffer:', e);
        }
    };
    const muteAudio = () => {
        if (localTrack) {
            localTrack.stop();
            localTrack = null;
        }
        if (localStream) {
            localStream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
            localStream = null;
        }
    };
    const unmuteAudio = async () => {
        if (!localTrack || localTrack.readyState === 'ended') {
            if (localStream) {
                localStream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
                localStream = null;
            }
            localTrack = null;
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStream = stream;
            localTrack = stream.getAudioTracks()[0]!;
            await audioSender.replaceTrack(localTrack);
        }
        localTrack!.enabled = true;
    };
    return { pc, stop, onEvent, commitAudioBuffer, clearAudioBuffer, muteAudio, unmuteAudio };
}
