import { notification } from 'antd';
import { Questionnaire, QuestionnaireItem } from 'fhir/r4b';
import { useEffect, useMemo, useRef, useState } from 'react';
import { mapResponseToForm, type GroupItemProps } from 'sdc-qrf';

import { isFailure } from '@beda.software/remote-data';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { aiService } from 'src/services/ai';
import { getToken } from 'src/services/auth';
import { compileAsFirst } from 'src/utils';

import { RealtimeVoiceSession, startRealtimeVoice } from './connection';
import { merge, normalize } from './utils';

const getByLinkId = compileAsFirst<Questionnaire, QuestionnaireItem>(
    'Questionnaire.repeat(item).where(linkId=%linkId)',
);

type ConnectionStatus = 'notStarted' | 'connecting' | 'connected';

export function useGroupVoice(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;
    const { linkId } = questionItem;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    // We keep the extracted QR items inside the group form field.
    // For non-repeatable groups, the expected value is: { question?: string, items?: FormItems }.
    const { value, onChange } = useFieldController<any>(fieldName, questionItem);

    const [gen, setGen] = useState(0);
    const rootContext = context[0];
    const questionItemFHIR = getByLinkId(rootContext!.questionnaire!, { linkId });
    const voice = useRef<RealtimeVoiceSession>();
    const [connection, setConnection] = useState<ConnectionStatus>('notStarted');
    const [text, setText] = useState('');

    async function startRecording() {
        setConnection('connecting');
        voice.current = await startRealtimeVoice(aiService);
        function _handleEvent(evt: any) {
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
                populate(evt.transcript);
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

    async function populate(textFromAudio: string) {
        const questionnaire: Questionnaire = {
            resourceType: 'Questionnaire',
            status: 'active',
            item: [questionItemFHIR!],
        };
        const extractResponse = await aiService<any>({
            method: 'POST',
            url: '/populate',
            data: {
                text: textFromAudio,
                questionnaire,
            },
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (isFailure(extractResponse)) {
            notification.error({ message: JSON.stringify(extractResponse.error) });
            return;
        }

        const old = { [linkId]: value };
        const newValue = mapResponseToForm(extractResponse.data, questionnaire);
        const mergedValue = merge(old, newValue);
        const result = normalize(
            mergedValue,
            (linkId: string) => getByLinkId(rootContext!.questionnaire!, { linkId })!,
        );
        onChange(result[linkId] ?? {});
        setGen((g) => g + 1);
        setText('');
    }

    return {
        connection,
        startRecording,
        stopRecording,
        text,
        gen,
    };
}
