import { AudioOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Form, UploadFile } from 'antd';
import { useCallback, useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { AudioPlayer as AudioPlayerControl, AudioRecorder as AudioRecorderControl } from 'src/components/AudioRecorder';
import { useAudioRecorder } from 'src/components/AudioRecorder/hooks';

import { useUploader } from '../UploadFileControl/hooks';
import { RcFile } from 'antd/lib/upload/interface';
import { isSuccess } from '@beda.software/remote-data';
import { S } from './styles';
import { UploadFileControl } from '../UploadFileControl';

export function AudioRecorderUploader(props: QuestionItemProps) {
    const { questionItem } = props;
    const [showScriber, setShowScriber] = useState(false);

    const { recorderControls } = useAudioRecorder();
    const { formItem, customRequest, onChange, fileList } = useUploader(props);
    const hasFiles = fileList.length > 0;

    const onScribeChange = useCallback(
        async (file: RcFile) => {
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
        [fileList],
    );

    const renderContent = () => {
        if (hasFiles) {
            return (
                <S.Container>
                    <AudioPlayerControl files={fileList} />
                </S.Container>
            );
        }

        if (showScriber) {
            return (
                <S.Container>
                    <AudioRecorderControl recorderControls={recorderControls} onChange={onScribeChange} />
                </S.Container>
            );
        }

        return (
            <>
                <S.Button
                    icon={<AudioOutlined />}
                    type="primary"
                    onClick={() => {
                        setShowScriber(true);
                        recorderControls.startRecording();
                    }}
                >
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
