import { AudioOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Alert, Button, notification } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { Questionnaire, QuestionnaireItem } from 'fhir/r4b';
import { useEffect, useMemo, useState } from 'react';
import * as _ from 'lodash';
import {
    mapResponseToForm,
    QuestionItems,
    useQuestionnaireResponseFormContext,
    type GroupItemProps,
} from 'sdc-qrf';

import { isFailure } from '@beda.software/remote-data';

import { AudioRecorder } from 'src/components/AudioRecorder';
import { useAudioRecorder } from 'src/components/AudioRecorder/hooks';
import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { Paragraph, Text } from 'src/components/Typography';
import { aiService } from 'src/services/ai';
import { getToken } from 'src/services/auth';
import { compileAsFirst } from 'src/utils';
import { merge, normalize} from './utils';

function GroupVoiceScriber(props: { disabled?: boolean; onRecorded: (file: RcFile) => Promise<void> }) {
    const { disabled, onRecorded } = props;
    const { recorderControls } = useAudioRecorder();

    useEffect(() => {
        if (!disabled) {
            recorderControls.startRecording();
        }
    }, [disabled, recorderControls]);

    return <AudioRecorder recorderControls={recorderControls} onChange={onRecorded} />;
}

const getByLinkId = compileAsFirst<Questionnaire, QuestionnaireItem>('Questionnaire.repeat(item).where(linkId=%linkId)');

export function GroupVoice(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;
    const { linkId, repeats, text, hidden, item, readOnly } = questionItem;

    const qrfContext = useQuestionnaireResponseFormContext();
    const isFormReadOnly = qrfContext.readOnly || !!readOnly;

    const fieldName = useMemo(() => [...parentPath, linkId], [parentPath, linkId]);

    // We keep the extracted QR items inside the group form field.
    // For non-repeatable groups, the expected value is: { question?: string, items?: FormItems }.
    const { value, onChange } = useFieldController<any>(fieldName, questionItem);

    const [isExtracting, setIsExtracting] = useState(false);
    const [showScriber, setShowScriber] = useState(false);
    const [transcribedText, setTranscribedText] = useState<string | null>(null);

    const [gen, setGen] = useState(0);
    const rootContext = context[0];
    const questionItemFHIR = getByLinkId(rootContext?.questionnaire!, { linkId });

    const extractAndFillGroup = async (file: RcFile) => {
        setShowScriber(false);
        setIsExtracting(true);

        const formData = new FormData();
        formData.append('file', file);

        const transcribeResponse = await aiService<{ text: string }>({
            method: 'POST',
            url: '/transcribe',
            data: formData,
            headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart' },
        });

        if (isFailure(transcribeResponse)) {
            notification.error({ message: JSON.stringify(transcribeResponse.error) });
            setIsExtracting(false);
            return;
        }

        const textFromAudio = transcribeResponse.data.text ?? '';
        setTranscribedText(textFromAudio);

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
            setIsExtracting(false);
            return;
        }

        const old = { [linkId]: value };
        const newValue = mapResponseToForm(extractResponse.data, questionnaire);
        const mergedValue = merge(old, newValue);
        console.log("newValue", mergedValue);
        const result = normalize(mergedValue,
                                 (linkId:string) => getByLinkId(rootContext?.questionnaire!, { linkId })!);
        console.log("merge", old, "with", newValue, "=>", result);

        onChange(result[linkId] ?? {});
        setGen((g) => g + 1);
        setIsExtracting(false);
    };

    if (hidden) {
        return null;
    }

    if (repeats) {
        return <Alert type="error" message={t`This itemControl is designed for non-repeatable groups`} />;
    }

    if (!item) {
        return null;
    }

    return (
        <div style={{ margin: '0 0 32px' }} id={`group-${linkId}`}>
            {text ? (
                <Paragraph style={{ fontSize: 18, fontWeight: 'bold', margin: '32px 0 8px' }}>{text}</Paragraph>
            ) : null}

            {!isFormReadOnly ? (
                <div style={{ marginBottom: 12 }}>
                    <Button
                        icon={<AudioOutlined />}
                        type="primary"
                        onClick={() => setShowScriber(true)}
                        disabled={isExtracting}
                    >
                        <span>
                            <Trans>{transcribedText ? 'Re-record voice' : 'Record voice'}</Trans>
                        </span>
                    </Button>
                </div>
            ) : null}

            {showScriber ? <GroupVoiceScriber disabled={isExtracting} onRecorded={extractAndFillGroup} /> : null}

            {isExtracting ? (
                <Text style={{ display: 'block', marginBottom: 12 }}>
                    <Trans>Processing voice…</Trans>
                </Text>
            ) : null}

            {transcribedText && !isFormReadOnly ? (
                <Text style={{ display: 'block', marginBottom: 12 }}>{transcribedText}</Text>
            ) : null}

            <QuestionItems
                key={gen}
                questionItems={item}
                parentPath={[...parentPath, linkId, 'items']}
                context={rootContext!}
            />
        </div>
    );
}
