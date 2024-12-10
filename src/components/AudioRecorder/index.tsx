import { Trans } from '@lingui/macro';
// eslint-disable-next-line
import { AudioRecorder as AudioRecorderControl } from 'react-audio-voice-recorder';

import { RecorderControls } from './hooks';
import { S } from './styles';
import { uuid4 } from '@beda.software/fhir-react';
import { Upload, type UploadFile } from 'antd';
import React from 'react';
import { RcFile } from 'antd/lib/upload/interface';

interface AudioRecorderProps {
    onChange: (url: RcFile) => Promise<void>;
    recorderControls: RecorderControls;
}

export function AudioRecorder(props: AudioRecorderProps) {
    const { recorderControls, onChange } = props;

    const onRecordingComplete = async (blob: Blob) => {
        const uuid = uuid4();
        const audioFile = new File([blob], `${uuid}.webm`, { type: blob.type }) as RcFile;
        audioFile.uid = uuid;
        onChange(audioFile);
    };

    return (
        <S.Scriber>
            <S.Title $danger>
                <Trans>Capture in progress</Trans>
            </S.Title>
            <AudioRecorderControl
                showVisualizer
                onRecordingComplete={onRecordingComplete}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }}
                recorderControls={{
                    ...recorderControls,
                }}
            />
        </S.Scriber>
    );
}

interface AudioPlayerProps {
    files: UploadFile[];
    onRemove?: (file: UploadFile) => void;
}

export function AudioPlayer(props: AudioPlayerProps) {
    const { files, onRemove } = props;

    return (
        <S.Scriber>
            <S.Title>
                <Trans>Listen to the audio</Trans>
            </S.Title>
            {files.map((file) => (
                <React.Fragment key={file.uid}>
                    <S.Audio controls src={file.url} />
                    <Upload
                        listType="text"
                        showUploadList={{ showRemoveIcon: !!onRemove }}
                        fileList={[file]}
                        onRemove={() => onRemove?.(file)}
                    />
                </React.Fragment>
            ))}
        </S.Scriber>
    );
}
