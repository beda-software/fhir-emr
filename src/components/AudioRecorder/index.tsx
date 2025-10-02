import { DeleteOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Upload, type UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
// eslint-disable-next-line
import { AudioRecorder as AudioRecorderControl } from 'react-audio-voice-recorder';

import { uuid4 } from '@beda.software/fhir-react';

import { Text } from 'src/components/Typography';

import { RecorderControls } from './hooks';
import { S } from './styles';

interface AudioRecorderProps {
    onChange: (url: RcFile) => Promise<void>;
    recorderControls: RecorderControls;
}

function checkIfSafari() {
    const userAgent = navigator.userAgent;
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    return isSafari;
}

export function AudioRecorder(props: AudioRecorderProps) {
    const { recorderControls, onChange } = props;

    const onRecordingComplete = async (blob: Blob) => {
        const uuid = uuid4();
        const audioTypeWithoutCodecs = blob.type.split(';')[0] ?? '';
        const audioExt = audioTypeWithoutCodecs.split('/')[1];
        const audioFile = new File([blob], `${uuid}.${audioExt}`, { type: blob.type }) as RcFile;
        audioFile.uid = uuid;
        onChange(audioFile);
    };

    return (
        <S.Scriber>
            <S.Title $danger>
                <Trans>Capture in progress</Trans>
            </S.Title>
            {/* Do not include downloadFileExtension so Safari could record mp4 and Chrome webm */}
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
    const { files } = props;

    return (
        <S.Scriber>
            <S.Title>
                <Trans>Listen to the audio</Trans>
            </S.Title>
            {files.map((file) => (
                <AudioPlayerRecord key={file.name} file={file} {...props} />
            ))}
        </S.Scriber>
    );
}

interface AudioPlayerRecordProps {
    file: UploadFile;
    onRemove?: (file: UploadFile) => void;
}

export function AudioPlayerRecord(props: AudioPlayerRecordProps) {
    const { file, onRemove } = props;
    const audioExt = file.name.split('.')[1];
    const isSafari = checkIfSafari();
    const isWebm = audioExt === 'webm';

    return (
        <>
            {file.url && file.name === file.uid ? (
                <>
                    {isSafari && isWebm ? (
                        <Text>
                            <Trans>
                                This audio cannot be played in Safari, please download the audio or use the Chrome
                                browser
                            </Trans>
                        </Text>
                    ) : (
                        <S.Audio controls preload="none">
                            <source src={file.url} type={`audio/${audioExt}`} />
                            <Text>
                                <Trans>Your browser does not support the audio element</Trans>
                            </Text>
                        </S.Audio>
                    )}
                </>
            ) : null}
            <Upload
                listType="text"
                showUploadList={{ showRemoveIcon: !!onRemove }}
                fileList={[file]}
                onRemove={() => onRemove?.(file)}
                itemRender={(originNode, file) => {
                    if (file.url) {
                        return (
                            <S.File>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ant-upload-list-item-name"
                                    title={file.name}
                                    href={file.url}
                                >
                                    <Trans>Download audio</Trans>
                                </a>
                                {onRemove ? (
                                    <S.Button
                                        type="text"
                                        onClick={() => onRemove(file)}
                                        icon={<DeleteOutlined />}
                                        size="small"
                                    />
                                ) : null}
                            </S.File>
                        );
                    }

                    return originNode;
                }}
            />
        </>
    );
}
