import { AudioOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Form, UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import { useCallback, useEffect, useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { isSuccess } from '@beda.software/remote-data';

import { AudioPlayer as AudioPlayerControl, AudioRecorder as AudioRecorderControl } from 'src/components/AudioRecorder';
import { useAudioRecorder } from 'src/components/AudioRecorder/hooks';

import { S } from './styles';
import { UploadFileControl } from '../UploadFileControl';
import { useUploader } from '../UploadFileControl/hooks';

interface AudioRecorderUploaderExtraProps {
    onRecorded?: (file: RcFile) => void;
}

export function AudioRecorderUploader(props: QuestionItemProps & AudioRecorderUploaderExtraProps) {
    const { questionItem, onRecorded } = props;
    const [showScriber, setShowScriber] = useState(false);

    const { formItem, customRequest, onChange, fileList, onRemove } = useUploader(props);
    const hasFiles = fileList.length > 0;

    const onScribeChange = useCallback(
        async (file: RcFile) => {
            if (onRecorded) {
                onRecorded(file);
            }
            setShowScriber(false);

            const fileClone = new File([file], file.name, {
                type: file.type,
            }) as any as UploadFile;
            fileClone.uid = file.uid;
            fileClone.status = 'uploading';
            fileClone.percent = 0;

            onChange({
                fileList: [...fileList, fileClone],
                file: fileClone,
            });

            const response = await customRequest({ file });

            if (isSuccess(response)) {
                fileClone.status = 'done';
                fileClone.url = response.data.uploadUrl;
                fileClone.percent = 100;

                onChange({
                    fileList: [...fileList, fileClone],
                    file: fileClone,
                });
            }
        },
        [fileList, onRecorded],
    );

    const renderContent = () => {
        if (hasFiles) {
            return (
                <S.Container>
                    <AudioPlayerControl files={fileList} onRemove={onRemove} />
                </S.Container>
            );
        }

        if (showScriber) {
            return <Scriber onChange={onScribeChange} />;
        }

        return (
            <>
                <S.Button icon={<AudioOutlined />} type="primary" onClick={() => setShowScriber(true)}>
                    <span>
                        <Trans>Start scribe</Trans>
                    </span>
                </S.Button>
                <UploadFileControl
                    {...props}
                    questionItem={{
                        ...questionItem,
                        text: undefined,
                    }}
                />
            </>
        );
    };

    return <Form.Item {...formItem}>{renderContent()}</Form.Item>;
}

interface ScriberProps {
    onChange: (url: RcFile) => Promise<void>;
}

function Scriber(props: ScriberProps) {
    const { onChange } = props;
    const { recorderControls } = useAudioRecorder();

    useEffect(() => {
        recorderControls.startRecording();
    }, []);

    return (
        <S.Container>
            <AudioRecorderControl recorderControls={recorderControls} onChange={onChange} />
        </S.Container>
    );
}
